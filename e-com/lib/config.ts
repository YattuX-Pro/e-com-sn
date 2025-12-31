// Configuration centralisée pour les URLs
// URL de l'API backend (avec /api pour les endpoints)
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

// URL statique pour les fichiers (images, etc.) - toujours pointer vers api.yoobouko-hasilazamotor.com
const STATIC_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.yoobouko-hasilazamotor.com'
  : 'http://localhost:5001'

// Helper pour construire les URLs d'images
export const getImageUrl = (path: string): string => {
  if (!path) return '/placeholder.jpg'
  
  // Si c'est déjà une URL complète vers notre API, la retourner
  if (path.startsWith('https://api.yoobouko-hasilazamotor.com')) {
    return path
  }
  
  // Si c'est une autre URL complète, la retourner telle quelle
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // Nettoyer le chemin : garder seulement /products/... ou le chemin relatif
  let cleanPath = path
  
  // Enlever tout ce qui précède /products/ si présent
  const productsIndex = path.indexOf('/products/')
  if (productsIndex !== -1) {
    cleanPath = path.substring(productsIndex)
  } else {
    // Sinon, nettoyer les caractères bizarres au début
    cleanPath = path.replace(/^[.\s]+/, '').replace(/^[^/]*\/products/, '/products')
    if (!cleanPath.startsWith('/')) {
      cleanPath = `/${cleanPath}`
    }
  }
  
  return `${STATIC_BASE_URL}${cleanPath}`
}
