// Configuration centralisée pour les URLs
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

// URL de base sans /api pour les images et fichiers statiques
export const API_URL = API_BASE_URL
export const STATIC_URL = API_BASE_URL.replace('/api', '')

// Helper pour construire les URLs d'images
export const getImageUrl = (path: string) => `${STATIC_URL}${path}`
