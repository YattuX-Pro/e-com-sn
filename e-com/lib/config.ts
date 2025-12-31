// Configuration centralisée pour les URLs
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

// URL de base sans /api pour les images et fichiers statiques
export const API_URL = API_BASE_URL
export const STATIC_URL = API_BASE_URL.replace('/api', '')

// Helper pour construire les URLs d'images
export const getImageUrl = (path: string) => {
  if (!path) return ''
  
  // Si c'est déjà une URL complète, la retourner telle quelle
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // Nettoyer le chemin : enlever les points, espaces et caractères bizarres au début
  let cleanPath = path.trim().replace(/^[.\s]+/, '')
  
  // S'assurer que le chemin commence par /
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`
  }
  
  return `${STATIC_URL}${cleanPath}`
}
