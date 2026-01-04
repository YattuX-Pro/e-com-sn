const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

let authToken: string | null = null;

if (typeof window !== 'undefined') {
  authToken = localStorage.getItem('token');
}

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
};

export const getAuthToken = () => authToken;

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  shortDescription: string;
  category: string;
  image: string;
  images: string[];
  bestSeller: boolean;
  isPromoted: boolean;
  isActive: boolean;
  stock: number;
  marque: string;
  modele: string;
  dimension: string;
  genre: string;
  freinage: string;
  systemeD: string;
  dimensionCaisseChargement: string;
  boiteVitesse: string;
  specificationTechnique: string;
  capaciteCharge: string;
  typeCarburant: string;
  etat: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface OrderStatus {
  id: string;
  code: string;
  label: string;
  description?: string;
  createdAt: string;
}

export interface UserRole {
  id: string;
  code: string;
  label: string;
  description?: string;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface ProductFilterParams extends PaginationParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  bestSeller?: boolean;
  isPromoted?: boolean;
  inStock?: boolean;
}

export interface OrderFilterParams extends PaginationParams {
  orderId?: string;
  status?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface UserFilterParams extends PaginationParams {
  role?: string;
  status?: string;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (options?.headers) {
    Object.assign(headers, options.headers);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Ne pas rediriger automatiquement si on est déjà sur la page de login
      const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';
      
      if (!isLoginPage) {
        setAuthToken(null);
        if (typeof window !== 'undefined') {
          document.cookie = 'token=; path=/; max-age=0';
          window.location.href = '/login';
        }
      }
      throw new Error('401: Non autorisé');
    }
    
    let errorMessage = `${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error || errorData.message) {
        errorMessage = errorData.error || errorData.message;
      }
    } catch {
      // Ignore JSON parse errors
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
}

export const productsApi = {
  getAll: () => fetchApi<Product[]>('/products'),
  getPaged: (params: ProductFilterParams) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.pageSize) query.append('pageSize', params.pageSize.toString());
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.minPrice) query.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) query.append('maxPrice', params.maxPrice.toString());
    if (params.bestSeller !== undefined) query.append('bestSeller', params.bestSeller.toString());
    if (params.isPromoted !== undefined) query.append('isPromoted', params.isPromoted.toString());
    if (params.inStock !== undefined) query.append('inStock', params.inStock.toString());
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortDescending) query.append('sortDescending', params.sortDescending.toString());
    return fetchApi<PagedResult<Product>>(`/products/paged?${query.toString()}`);
  },
  getById: (id: string) => fetchApi<Product>(`/products/${id}`),
  create: (data: Omit<Product, 'id' | 'createdAt'>) => 
    fetchApi<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Omit<Product, 'id' | 'createdAt'>) =>
    fetchApi<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  toggleActive: (id: string) =>
    fetchApi<Product>(`/products/${id}/toggle-active`, { method: 'PATCH' }),
  delete: (id: string) =>
    fetchApi<void>(`/products/${id}`, { method: 'DELETE' }),
};

export const ordersApi = {
  getAll: () => fetchApi<Order[]>('/orders'),
  getPaged: (params: OrderFilterParams) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.pageSize) query.append('pageSize', params.pageSize.toString());
    if (params.search) query.append('search', params.search);
    if (params.orderId) query.append('orderId', params.orderId);
    if (params.status) query.append('status', params.status);
    if (params.fromDate) query.append('fromDate', params.fromDate.toISOString());
    if (params.toDate) query.append('toDate', params.toDate.toISOString());
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortDescending) query.append('sortDescending', params.sortDescending.toString());
    return fetchApi<PagedResult<Order>>(`/orders/paged?${query.toString()}`);
  },
  getById: (id: string) => fetchApi<Order>(`/orders/${id}`),
  create: (data: { customerName: string; customerPhone: string; customerEmail: string; customerAddress: string; productId: string; quantity: number }) =>
    fetchApi<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateStatus: (id: string, status: Order['status']) =>
    fetchApi<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  delete: (id: string) =>
    fetchApi(`/orders/${id}`, {
      method: 'DELETE',
    }),
};

export const categoriesApi = {
  getAll: () => fetchApi<Category[]>('/categories'),
  getById: (id: string) => fetchApi<Category>(`/categories/${id}`),
  create: (data: Omit<Category, 'id' | 'createdAt'>) => 
    fetchApi<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Omit<Category, 'id' | 'createdAt'>) => 
    fetchApi<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => 
    fetchApi(`/categories/${id}`, {
      method: 'DELETE',
    }),
};

export const orderStatusesApi = {
  getAll: () => fetchApi<OrderStatus[]>('/order-statuses'),
  getById: (id: string) => fetchApi<OrderStatus>(`/order-statuses/${id}`),
  create: (data: Omit<OrderStatus, 'id' | 'createdAt'>) => 
    fetchApi<OrderStatus>('/order-statuses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Omit<OrderStatus, 'id' | 'createdAt'>) => 
    fetchApi<OrderStatus>(`/order-statuses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => 
    fetchApi(`/order-statuses/${id}`, {
      method: 'DELETE',
    }),
};

export const userRolesApi = {
  getAll: () => fetchApi<UserRole[]>('/user-roles'),
  getById: (id: string) => fetchApi<UserRole>(`/user-roles/${id}`),
  create: (data: Omit<UserRole, 'id' | 'createdAt'>) => 
    fetchApi<UserRole>('/user-roles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Omit<UserRole, 'id' | 'createdAt'>) => 
    fetchApi<UserRole>(`/user-roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => 
    fetchApi(`/user-roles/${id}`, {
      method: 'DELETE',
    }),
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: (data: LoginRequest) =>
    fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  register: (data: RegisterRequest) =>
    fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const usersApi = {
  getAll: () => fetchApi<User[]>('/users'),
  getPaged: (params: UserFilterParams) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.pageSize) query.append('pageSize', params.pageSize.toString());
    if (params.search) query.append('search', params.search);
    if (params.role) query.append('role', params.role);
    if (params.status) query.append('status', params.status);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortDescending) query.append('sortDescending', params.sortDescending.toString());
    return fetchApi<PagedResult<User>>(`/users/paged?${query.toString()}`);
  },
  getById: (id: string) => fetchApi<User>(`/users/${id}`),
  create: (data: Omit<User, 'id' | 'createdAt'>) =>
    fetchApi<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Omit<User, 'id' | 'createdAt'>) =>
    fetchApi<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchApi<void>(`/users/${id}`, { method: 'DELETE' }),
};

export interface SparePart {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  stock: number;
  isActive: boolean;
  reference: string;
  compatibilite: string;
  createdAt: string;
}

export const sparePartsApi = {
  getAll: () => fetchApi<SparePart[]>('/spareparts'),
  getById: (id: string) => fetchApi<SparePart>(`/spareparts/${id}`),
  create: (data: Omit<SparePart, 'id' | 'createdAt'>) =>
    fetchApi<SparePart>('/spareparts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Omit<SparePart, 'id' | 'createdAt'>) =>
    fetchApi<SparePart>(`/spareparts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi<void>(`/spareparts/${id}`, { method: 'DELETE' }),
  addImage: (id: string, imageUrl: string) =>
    fetchApi<SparePart>(`/spareparts/${id}/images`, { method: 'POST', body: JSON.stringify(imageUrl) }),
  removeImage: (id: string, imageUrl: string) =>
    fetchApi<SparePart>(`/spareparts/${id}/images`, { method: 'DELETE', body: JSON.stringify(imageUrl) }),
};

export interface RepairRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  vehicleType: string;
  vehicleModel: string;
  problemDescription: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

export const repairRequestsApi = {
  getAll: () => fetchApi<RepairRequest[]>('/repair-requests'),
  getById: (id: string) => fetchApi<RepairRequest>(`/repair-requests/${id}`),
  updateStatus: (id: string, status: string, notes?: string) =>
    fetchApi<RepairRequest>(`/repair-requests/${id}`, { method: 'PUT', body: JSON.stringify({ status, notes }) }),
  delete: (id: string) => fetchApi<void>(`/repair-requests/${id}`, { method: 'DELETE' }),
};

export interface SparePartOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  sparePartId: string;
  sparePartName: string;
  sparePartReference: string;
  quantity: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface SparePartOrderFilterParams extends PaginationParams {
  status?: string;
}

export interface SparePartCategory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface DashboardStats {
  productsCount: number;
  ordersCount: number;
  usersCount: number;
  sparePartsCount: number;
  repairRequestsCount: number;
  sparePartOrdersCount: number;
}

export interface RecentOrder {
  id: string;
  orderId: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface RecentSparePartOrder {
  id: string;
  orderId: string;
  customerName: string;
  sparePartName: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface RecentRepairRequest {
  id: string;
  customerName: string;
  vehicleModel: string;
  problemDescription: string;
  status: string;
  createdAt: string;
}

export interface PopularProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export const dashboardApi = {
  getStats: () => fetchApi<DashboardStats>('/dashboard/stats'),
  getRecentOrders: (count?: number) => fetchApi<RecentOrder[]>(`/dashboard/recent-orders${count ? `?count=${count}` : ''}`),
  getRecentSparePartOrders: (count?: number) => fetchApi<RecentSparePartOrder[]>(`/dashboard/recent-spare-part-orders${count ? `?count=${count}` : ''}`),
  getRecentRepairRequests: (count?: number) => fetchApi<RecentRepairRequest[]>(`/dashboard/recent-repair-requests${count ? `?count=${count}` : ''}`),
  getPopularProducts: (count?: number) => fetchApi<PopularProduct[]>(`/dashboard/popular-products${count ? `?count=${count}` : ''}`),
};

export const sparePartCategoriesApi = {
  getAll: () => fetchApi<SparePartCategory[]>('/spare-part-categories'),
  getById: (id: string) => fetchApi<SparePartCategory>(`/spare-part-categories/${id}`),
  create: (data: Omit<SparePartCategory, 'id' | 'createdAt'>) =>
    fetchApi<SparePartCategory>('/spare-part-categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Omit<SparePartCategory, 'id' | 'createdAt'>) =>
    fetchApi<SparePartCategory>(`/spare-part-categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchApi<void>(`/spare-part-categories/${id}`, { method: 'DELETE' }),
};

export const sparePartOrdersApi = {
  getAll: () => fetchApi<SparePartOrder[]>('/spare-part-orders'),
  getPaged: (params: SparePartOrderFilterParams) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.pageSize) query.append('pageSize', params.pageSize.toString());
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    return fetchApi<PagedResult<SparePartOrder>>(`/spare-part-orders/paged?${query.toString()}`);
  },
  getById: (id: string) => fetchApi<SparePartOrder>(`/spare-part-orders/${id}`),
  updateStatus: (id: string, status: SparePartOrder['status']) =>
    fetchApi<SparePartOrder>(`/spare-part-orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  delete: (id: string) => fetchApi(`/spare-part-orders/${id}`, { method: 'DELETE' }),
};
