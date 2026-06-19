import type {
  BaseRecord,
  CreateParams,
  CustomParams,
  DataProvider,
  DeleteOneParams,
  GetListParams,
  GetManyParams,
  GetOneParams,
  UpdateParams,
} from '@refinedev/core'

async function request<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

type ListEnvelope = { data: unknown[]; total: number }

export const adminDataProvider: DataProvider = {
  getApiUrl: () => '/api/admin',

  getList: async <TData extends BaseRecord = BaseRecord>(
    params: GetListParams,
  ): Promise<{ data: TData[]; total: number }> => {
    const search = new URLSearchParams({ page: '0', size: '50' })
    if (params.pagination?.currentPage !== undefined && params.pagination?.pageSize !== undefined) {
      search.set('page', String(params.pagination.currentPage - 1))
      search.set('size', String(params.pagination.pageSize))
    }
    const envelope = await request<ListEnvelope>(
      `/api/admin/${params.resource}?${search.toString()}`,
    )
    return { data: envelope.data as TData[], total: envelope.total }
  },

  getOne: async <TData extends BaseRecord = BaseRecord>(
    params: GetOneParams,
  ): Promise<{ data: TData }> => {
    const data = await request<TData>(`/api/admin/${params.resource}/${params.id}`)
    return { data }
  },

  getMany: async <TData extends BaseRecord = BaseRecord>(
    params: GetManyParams,
  ): Promise<{ data: TData[] }> => {
    const data = await Promise.all(
      params.ids.map((id) =>
        request<TData>(`/api/admin/${params.resource}/${id}`),
      ),
    )
    return { data }
  },

  create: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>(
    params: CreateParams<TVariables>,
  ): Promise<{ data: TData }> => {
    const data = await request<TData>(`/api/admin/${params.resource}`, {
      method: 'POST',
      body: JSON.stringify(params.variables),
    })
    return { data }
  },

  update: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>(
    params: UpdateParams<TVariables>,
  ): Promise<{ data: TData }> => {
    const data = await request<TData>(`/api/admin/${params.resource}/${params.id}`, {
      method: 'PATCH',
      body: JSON.stringify(params.variables),
    })
    return { data }
  },

  deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>(
    params: DeleteOneParams<TVariables>,
  ): Promise<{ data: TData }> => {
    await request<void>(`/api/admin/${params.resource}/${params.id}`, {
      method: 'DELETE',
    })
    return { data: { id: params.id } as unknown as TData }
  },

  custom: async <TData extends BaseRecord = BaseRecord>(
    params: CustomParams,
  ): Promise<{ data: TData }> => {
    const data = await request<TData>(params.url, {
      method: params.method,
      body: params.payload ? JSON.stringify(params.payload) : undefined,
    })
    return { data }
  },
}
