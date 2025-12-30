"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Image as ImageIcon, Loader2, RefreshCw, Trash2, Plus } from "lucide-react"
import { API_URL, getImageUrl } from "@/lib/config"

interface ImageUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  productName: string
  currentImage?: string
  currentImages?: string[]
  onUploadComplete: () => void
}

export function ImageUploadDialog({ 
  open, 
  onOpenChange, 
  productId, 
  productName,
  currentImage,
  currentImages = [],
  onUploadComplete 
}: ImageUploadDialogProps) {
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)
  const [detailImageFiles, setDetailImageFiles] = useState<File[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")
  const [error, setError] = useState("")
  
  const MAX_IMAGES = 5
  const MAX_FILE_SIZE = 500 * 1024 // 500KB en bytes

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validation de la taille
      if (file.size > MAX_FILE_SIZE) {
        setError(`L'image principale doit faire moins de 500KB (taille actuelle: ${(file.size / 1024).toFixed(0)}KB)`)
        e.target.value = ''
        return
      }
      
      setError('')
      setMainImageFile(file)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDetailImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      
      // Calculer le nombre total d'images après ajout
      const currentImagesCount = currentImages.length - imagesToDelete.length
      const totalAfterUpload = currentImagesCount + files.length
      
      // Validation du nombre total d'images
      if (totalAfterUpload > MAX_IMAGES) {
        setError(`Maximum ${MAX_IMAGES} images de détails autorisées. Actuellement: ${currentImagesCount}, vous essayez d'ajouter: ${files.length}`)
        e.target.value = ''
        return
      }
      
      // Validation de la taille de chaque fichier
      const oversizedFiles = files.filter(f => f.size > MAX_FILE_SIZE)
      if (oversizedFiles.length > 0) {
        const fileNames = oversizedFiles.map(f => `${f.name} (${(f.size / 1024).toFixed(0)}KB)`).join(', ')
        setError(`Ces fichiers dépassent 500KB: ${fileNames}`)
        e.target.value = ''
        return
      }
      
      setError('')
      setDetailImageFiles(files)
    }
  }

  const handleDeleteImage = (imagePath: string) => {
    setImagesToDelete(prev => [...prev, imagePath])
  }

  const handleUndoDelete = (imagePath: string) => {
    setImagesToDelete(prev => prev.filter(img => img !== imagePath))
  }

  const handleUpload = async () => {
    setError("")
    setUploading(true)
    setUploadProgress("Préparation de l'upload...")

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      // Étape 1: Supprimer les images marquées
      if (imagesToDelete.length > 0) {
        setUploadProgress(`Suppression de ${imagesToDelete.length} image(s)...`)
        const deleteResponse = await fetch(`${API_URL}/products/${productId}/images/delete`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ imagePaths: imagesToDelete })
        })

        if (!deleteResponse.ok) {
          throw new Error('Échec de la suppression des images')
        }
      }

      // Étape 2: Uploader les nouvelles images
      if (mainImageFile || detailImageFiles.length > 0) {
        const formData = new FormData()
        
        if (mainImageFile) {
          setUploadProgress("Upload de l'image principale...")
          formData.append("mainImage", mainImageFile)
        }
        
        if (detailImageFiles.length > 0) {
          setUploadProgress(`Upload de ${detailImageFiles.length} image(s) de détails...`)
          detailImageFiles.forEach((file) => {
            formData.append("detailImages", file)
          })
        }

        setUploadProgress("Envoi au serveur...")
        const uploadResponse = await fetch(`${API_URL}/products/${productId}/images`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        if (!uploadResponse.ok) {
          throw new Error('Échec de l\'upload des images')
        }
      }

      setUploadProgress("Modifications enregistrées avec succès !")
      setTimeout(() => {
        onUploadComplete()
        onOpenChange(false)
        setMainImageFile(null)
        setMainImagePreview(null)
        setDetailImageFiles([])
        setImagesToDelete([])
        setUploadProgress("")
      }, 500)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'opération')
      setUploadProgress("")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-primary">Gérer les images - {productName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image principale */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Image principale</Label>
              {currentImage && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <RefreshCw className="size-3" />
                  Choisir une nouvelle image pour remplacer
                </span>
              )}
            </div>
            <div className="flex gap-4">
              {currentImage && (
                <div className="relative w-32 h-32 border-2 rounded-lg overflow-hidden">
                  <img src={getImageUrl(currentImage)} alt="Actuelle" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-semibold">
                    Actuelle
                  </div>
                </div>
              )}
              {mainImagePreview && (
                <div className="relative w-32 h-32 border-2 border-primary rounded-lg overflow-hidden">
                  <img src={mainImagePreview} alt="Nouvelle" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-primary/50 flex items-center justify-center text-white text-xs font-semibold">
                    Nouvelle
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="flex-1"
                disabled={uploading}
              />
              {mainImageFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="size-4" />
                  {mainImageFile.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() => {
                      setMainImageFile(null)
                      setMainImagePreview(null)
                    }}
                    disabled={uploading}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Images de détails */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Images de détails</Label>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Plus className="size-3" />
                Max {MAX_IMAGES} images (500KB chacune)
              </span>
            </div>
            {currentImages.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Images actuelles ({currentImages.length}/{MAX_IMAGES})
                  {imagesToDelete.length > 0 && (
                    <span className="text-destructive ml-2">- {imagesToDelete.length} à supprimer</span>
                  )}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {currentImages.map((img, idx) => {
                    const isMarkedForDeletion = imagesToDelete.includes(img)
                    return (
                      <div key={idx} className={`relative w-20 h-20 border-2 rounded-lg overflow-hidden transition-all ${
                        isMarkedForDeletion ? 'border-destructive opacity-50' : 'border-border'
                      }`}>
                        <img src={getImageUrl(img)} alt={`Détail ${idx + 1}`} className="w-full h-full object-cover" />
                        {isMarkedForDeletion ? (
                          <div className="absolute inset-0 bg-destructive/80 flex flex-col items-center justify-center">
                            <Trash2 className="size-4 text-white mb-1" />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-white hover:bg-white/20"
                              onClick={() => handleUndoDelete(img)}
                              disabled={uploading}
                            >
                              Annuler
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 size-6"
                            onClick={() => handleDeleteImage(img)}
                            disabled={uploading}
                          >
                            <X className="size-3" />
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleDetailImagesChange}
                className="flex-1"
                disabled={uploading}
              />
              {detailImageFiles.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="size-4" />
                  {detailImageFiles.length} fichier(s)
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() => setDetailImageFiles([])}
                    disabled={uploading}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {uploading && uploadProgress && (
            <div className="flex items-center gap-3 text-sm text-primary bg-primary/10 p-3 rounded-lg">
              <Loader2 className="size-4 animate-spin" />
              <span>{uploadProgress}</span>
            </div>
          )}
          
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
            Annuler
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={uploading || (!mainImageFile && detailImageFiles.length === 0 && imagesToDelete.length === 0)}
            className="bg-primary"
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="size-4 mr-2" />
                Uploader
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
