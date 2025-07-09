export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: "client" | "admin" | "staff"
}

export interface Service {
  id: number
  name: string
  description?: string
  price: number
  duration: number
  category?: string
  status: "active" | "inactive"
  created_at: string
}

export interface Appointment {
  id: number
  user_id: number
  service_id: number
  appointment_date: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes?: string
  created_at: string
  service_name?: string
  price?: number
  duration?: number
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
}

export interface ImageProcess {
  id: number
  user_id: number
  original_image: string
  processed_image?: string
  procedure_type: string
  enhancement_level: number
  created_at: string
  originalImage?: string
  processedImage?: string
}

export interface Review {
  id: number
  user_id: number
  service_id: number
  rating: number
  comment?: string
  created_at: string
  first_name?: string
  last_name?: string
  service_name?: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}
