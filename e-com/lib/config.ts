export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

const STATIC_BASE_URL = process.env.NEXT_PUBLIC_STATIC_URL || 'http://localhost:5001'

export const getImageUrl = (path: string): string => {
  if (!path) return '/placeholder.jpg'
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  let cleanPath = path
  
  const productsIndex = path.indexOf('/products/')
  if (productsIndex !== -1) {
    cleanPath = path.substring(productsIndex)
  } else {
    cleanPath = path.replace(/^[.\s]+/, '').replace(/^[^/]*\/products/, '/products')
    if (!cleanPath.startsWith('/')) {
      cleanPath = `/${cleanPath}`
    }
  }
  
  return `${STATIC_BASE_URL}${cleanPath}`
}
