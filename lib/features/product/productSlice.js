import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProducts = createAsyncThunk('products/fetchProducts', 
    async ({ storeId } = {}, thunkAPI) => {
        try {
            const url = '/api/products' + (storeId ? `?storeId=${encodeURIComponent(storeId)}` : '')
            const { data } = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'Cache-Control': 'no-cache',
                }
            })
            return data?.products || []
        } catch (error) {
            const isAxios = axios.isAxiosError?.(error)
            const status = isAxios ? (error.response?.status ?? null) : (error?.response?.status ?? null)
            const payload = isAxios ? (error.response?.data ?? null) : (error?.response?.data ?? null)

            console.error('Failed to fetch products:', {
                message: error?.message,
                status,
                url: error?.config?.url
            })

            return thunkAPI.rejectWithValue(
                payload || {
                    message: error?.message || 'Failed to fetch products',
                    status,
                }
            )
        }
   }
)

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: [],
        loading: true, // Start with loading true for initial state
        error: null,
        lastFetched: null,
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload
        },
        clearProduct: (state) => {
            state.list = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                // Only show loading if we don't have products yet
                if (state.list.length === 0) {
                    state.loading = true;
                }
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.list = action.payload
                state.loading = false;
                state.lastFetched = Date.now();
                state.error = null;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error;
                // Keep existing products visible on error
            })
    }
})

export const { setProduct, clearProduct } = productSlice.actions

export default productSlice.reducer