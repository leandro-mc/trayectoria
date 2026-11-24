import axios, { type AxiosInstance } from 'axios'
import { apiUrl } from '@/config/env'

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${apiUrl}/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})
