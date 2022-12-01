export interface ApiResponse<T> {
  data: {
    results: T
  }
}

export class FetchError extends Error {
  constructor(status: string = 'Status not available') {
    super(status)
  }
}
