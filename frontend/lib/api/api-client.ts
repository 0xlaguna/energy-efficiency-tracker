import { AxiosResponse } from "axios"

import axiosInstance from "@/config/axios/client-instance"

export const GET = async <T>(
  url: string,
  params: any,
  headers: any
): Promise<T> => {
  const response = await axiosInstance.get<T>(url, { params: params, headers })
  return response.data
}

export const POST = async <T, U>(
  url: string,
  data: T,
  headers: any
): Promise<U> => {
  const response = await axiosInstance.post<T, AxiosResponse<U>>(url, data, {
    headers,
  })
  return response.data
}

export const PATCH = async <T, U>(
  url: string,
  data: T,
  headers: any
): Promise<U> => {
  const response = await axiosInstance.patch<T, AxiosResponse<U>>(url, data, {
    headers,
  })
  return response.data
}

export const DELETE = async (url: string, params: any, headers: any) => {
  const response = await axiosInstance.delete(url, { params, headers })
  return response.data
}
