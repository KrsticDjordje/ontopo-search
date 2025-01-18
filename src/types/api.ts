export interface LoginResponse {
  jwt_token: string
  refresh_token: string
}

export interface SearchCriteria {
  size: string
  date: string
  time: string
}

export interface SearchTokenRequest {
  criteria: {
    date: string
    time: string
    size: string
  }
  marketplace_id: string
  locale: string
  geocodes: string[]
}

export interface SearchTokenResponse {
  search_id: string
  areas: Area[]
}

export interface Restaurant {
  post: {
    slug: string
    venue_name: string
  }
  availability: {
    areas: Array<{
      id: string
      name: string
      icon?: string
      options: Array<{
        time: string
      }>
    }>
    formattedRequest: {
      service: string
    }
  }
}

export interface SearchResponse {
  posts: Restaurant[]
  total: number
}

export interface Area {
  id: string
  icon?: string
  name: string
  text?: string
  options: Array<{
    time: string
    method: string
    text: string
    score?: number
  }>
  score?: number
} 