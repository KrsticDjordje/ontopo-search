import { defineStore } from 'pinia'
import { ref, computed, toRaw } from 'vue'
import type { Restaurant, SearchCriteria } from '@/types/api'
import { loginAnonymously, getSearchToken, searchRestaurants } from '@/services/api'

export const useRestaurantStore = defineStore('restaurant', () => {
    const restaurants = ref<Restaurant[]>([])
    const total = ref(0)
    const isLoading = ref(false)
    const currentPage = ref(1)
    const searchId = ref('')

    async function initializeSearch(criteria: SearchCriteria) {
        isLoading.value = true
        restaurants.value = []
        currentPage.value = 1
        try {
            console.log('🔍 Inicijalizacija pretrage sa kriterijumima:', criteria)
            
            const loginResponse = await loginAnonymously()
            console.log('🔑 Login response:', loginResponse)
            
            const searchToken = await getSearchToken(loginResponse.jwt_token, criteria)
            console.log('🎫 Search token:', searchToken)
            searchId.value = searchToken.search_id
            
            const results = await searchRestaurants(loginResponse.jwt_token, searchId.value)
            console.log('📍 Initial search results:', results)
            
            restaurants.value = results.posts
            total.value = results.total
        } catch (error) {
            console.error('❌ Search error:', error)
        } finally {
            isLoading.value = false
        }
    }

    async function loadMore() {
        if (isLoading.value || !hasMore.value) return

        isLoading.value = true
        const existingRestaurants = toRaw(restaurants.value)
        
        try {
            console.log('📥 Loading more results, page:', currentPage.value + 1)
            
            const loginResponse = await loginAnonymously()
            const results = await searchRestaurants(
                loginResponse.jwt_token,
                searchId.value
            )
            console.log('�� Additional results:', results)
            
            restaurants.value = [...existingRestaurants, ...results.posts]
            currentPage.value++
        } catch (error) {
            console.error('❌ Load more error:', error)
            restaurants.value = existingRestaurants
        } finally {
            isLoading.value = false
        }
    }

    const hasMore = computed(() => {
        return restaurants.value.length < total.value
    })

    return {
        restaurants,
        total,
        isLoading,
        hasMore,
        initializeSearch,
        loadMore
    }
}) 