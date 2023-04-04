import { DefaultOptions, UseQueryOptions } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface RegisterErrorDto {
  // Register Error DTO
}
export interface RegisterOtherBaseUrls {
  // Register Other Base Urls
}

export type DTO<S extends string> = S extends `${infer T}_${infer U}` ? `${T}${Capitalize<DTO<U>>}` : S

export type Unpacked<T> = T extends (infer U)[] ? U : T

export type QueryKeyType<T extends CreateAxiosQueryEntranceType> = {
  queryParams: T['dynamicQueryParams']
  urlParams: T['endPointArgs']
}

export type DTONested<T> = T extends Array<any>
  ? Array<DTONested<T[number]>>
  : T extends object
  ? {
      [K in keyof T as DTO<K & string>]: DTONested<T[K]>
    }
  : T

export type ValueOf<T> = T[keyof T]

export type AxiosQueryTypeHelper<T extends CreateAxiosQueryEntranceType> = T
export type AxiosQueryMethodTypeHelper<T extends 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'> = T

export interface CreateAxiosQueryEntranceType {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  endPointArgs?: Record<string, number>
  responseData: Record<string, any>
  staticQueryParams?: Record<string, string | number>
  dynamicQueryParams?: Record<string, string | number>
  responseDataAfterDto?: Record<string, any>
  applyDefaultDto?: boolean
  dynamicRequestData?: Record<any, any>
  staticRequestData?: Record<any, any>
}

export type EndPointFunction<T> = (params: T) => string

export type QueryParamsType<S, D> = D extends Record<any, any> ? (args: Record<keyof D, ValueOf<D>>) => S & D : S

export type AxiosQueryObjectType<T extends CreateAxiosQueryEntranceType = CreateAxiosQueryEntranceType> = {
  name:
    | ((args: T['endPointArgs'] & T['dynamicQueryParams'] & T['staticQueryParams']) => (string | number | boolean)[])
    | string[]
  baseUrl?: keyof RegisterOtherBaseUrls | 'default'
  method: T['method']
  endPoint: EndPointFunction<T['endPointArgs']> | string
  queryParams?: QueryParamsType<T['staticQueryParams'], T['dynamicQueryParams']>
  options?: UseQueryOptions<T['responseDataAfterDto'], RegisterErrorDto> & {
    applyDefaultDto?: boolean
  }
  headers?: Record<string, string>
  timeout?: number
  dto?: (
    data: T['applyDefaultDto'] extends true ? DTONested<T['responseData']> : T['responseData'],
  ) => T['responseDataAfterDto']
} & (T['method'] extends 'GET' ? {} : { requestData?: T['staticRequestData'] })

export type CallBackArgsType<T extends CreateAxiosQueryEntranceType = CreateAxiosQueryEntranceType> = {
  urlParams: Record<keyof T['endPointArgs'], string | number>
  queryParams: T['dynamicQueryParams']
  requestData?: Record<string, any>
}

export type RequestType<T extends CreateAxiosQueryEntranceType> = T['dynamicQueryParams'] extends Record<any, any>
  ? ReturnType<QueryParamsType<T['staticQueryParams'], T['dynamicQueryParams']>>
  : T['staticQueryParams']

export type FinalResponseData<T extends CreateAxiosQueryEntranceType> = T['responseDataAfterDto'] extends unknown
  ? T['responseData']
  : T['responseDataAfterDto']

export type MiddelwareType = (data: AxiosResponse<any, any>) => void

export interface AxiosQueryProviderPropsType extends PropsWithChildren {
  defaultBaseUrl: string
  middleware?: MiddelwareType
  otherBaseUrl?: Record<keyof RegisterOtherBaseUrls, string>
  defaultOptions?: DefaultOptions<RegisterErrorDto> & {
    timeout?: number
    headers?: Record<string, string>
    errorDto?: (error: any) => RegisterErrorDto
  }
}

export type ContextType = {
  defaultBaseUrl?: AxiosQueryProviderPropsType['defaultBaseUrl']
  otherBaseUrl?: AxiosQueryProviderPropsType['otherBaseUrl']
  headers?: Record<string, string>
  timeout?: number
  commonErrorDto?: (error: any) => RegisterErrorDto
  middleware?: MiddelwareType
}

export type MultipleBaseUrlType = Record<string, string>
export type BaseUrlType = string | MultipleBaseUrlType

export interface ConstructorArgsType<BaseUrl> {
  baseUrl?: BaseUrl
  timeout: number
  options?: {
    hasDefaultDto?: boolean
    commonErrorDto?: (error: any) => RegisterErrorDto
    exteraDto?: (data: any) => any
  }
  publicHeaders?: any
}

export interface RequestConfigType<D = any, Q = any> extends AxiosRequestConfig {
  data?: D
  queryParams?: Q
}
export type FunctionType = (data?: any) => any