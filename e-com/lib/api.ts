const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

export interface Product {
  id: string
  name: string
  price: number
  description: string
  shortDescription: string
  category: string
  image: string
  images: string[]
  bestSeller: boolean
  isPromoted: boolean
  stock: number
  marque: string
  modele: string
  dimension: string
  genre: string
  freinage: string
  systemeD: string
  dimensionCaisseChargement: string
  boiteVitesse: string
  specificationTechnique: string
  createdAt: string
}

export interface CreateOrder {
  customerName: string
  customerPhone: string
  customerEmail: string
  customerAddress: string
  productId: string
  quantity: number
}

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerEmail: string
  customerAddress: string
  productId: string
  productName: string
  quantity: number
  totalPrice: number
  status: string
  createdAt: string
}

export const productsApi = {
  async getBestSellers(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products/bestsellers`)
    if (!response.ok) throw new Error('Failed to fetch bestsellers')
    return response.json()
  },

  async getPromoted(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products/promoted`)
    if (!response.ok) throw new Error('Failed to fetch promoted products')
    return response.json()
  },

  async getAll(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products`)
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  },

  async getById(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`)
    if (!response.ok) throw new Error('Failed to fetch product')
    return response.json()
  }
}

export interface Category {
  id: string
  name: string
}

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`)
    if (!response.ok) throw new Error('Failed to fetch categories')
    return response.json()
  }
}

export const ordersApi = {
  async create(order: CreateOrder): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create order')
    }
    return response.json()
  }
}
