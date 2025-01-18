import axios from 'axios'
import type { 
  LoginResponse, 
  SearchTokenRequest, 
  SearchTokenResponse, 
  SearchResponse,
  SearchCriteria 
} from '@/types/api'

const API_BASE_URL = 'https://site.ontopo.work/api'

// Helper funkcija za headere
function getHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'token': token
  }
}

// Konstante za fiksne vrednosti
const MARKETPLACE_ID = "15380287"
const LOCALE = "en"
const GEOCODES = ["belgrade"]

export async function loginAnonymously(): Promise<LoginResponse> {
  const response = await axios.post(`${API_BASE_URL}/loginAnonymously`)
  return response.data
}

export async function getSearchToken(
  jwtToken: string, 
  criteria: SearchCriteria
): Promise<SearchTokenResponse> {
  const request: SearchTokenRequest = {
    criteria: {
      date: criteria.date,
      time: criteria.time,
      size: String(criteria.size)
    },
    // Fiksne vrednosti
    marketplace_id: MARKETPLACE_ID,
    locale: LOCALE,
    geocodes: GEOCODES
  }

  console.log('Search token request:', JSON.stringify(request, null, 2))

  const response = await axios.post(
    `${API_BASE_URL}/search_token`,
    request,
    { headers: getHeaders(jwtToken) }
  )
  return response.data
}

export async function searchRestaurants(
  jwtToken: string,
  searchId: string
): Promise<SearchResponse> {
  const request = { search_id: searchId }
  
  console.log('Search request:', JSON.stringify(request, null, 2))
  
  const response = await axios.post(
    `${API_BASE_URL}/search_request`,
    request,
    { headers: getHeaders(jwtToken) }
  )
  return response.data
} 