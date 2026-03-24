export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  category: string
  images: string[]
  rating: number
  reviewCount: number
  specs: Record<string, string>
  inStock: boolean
  featured?: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  slug: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'Processando' | 'Em transporte' | 'Entregue'
  createdAt: string
  address: Address
}

export interface Address {
  cep: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
}