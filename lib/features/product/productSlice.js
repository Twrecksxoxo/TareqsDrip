import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProducts = createAsyncThunk('products/fetchProducts', 
    async ({ storeId } = {}, thunkAPI) => {
        try {
            const url = '/api/products' + (storeId ? `?storeId=${encodeURIComponent(storeId)}` : '')
            const { data } = await axios.get(url, { timeout: 15000 })
            return data?.products || []
        } catch (error) {
            const isAxios = axios.isAxiosError?.(error)

            // Axios network errors won't have `error.response`.
            const status = isAxios ? (error.response?.status ?? null) : (error?.response?.status ?? null)
            const payload = isAxios ? (error.response?.data ?? null) : (error?.response?.data ?? null)

            const kind = !isAxios ? 'non-axios' : (error.response ? 'http' : 'no-response')

            // Build a safe summary (AxiosError has many non-enumerable properties).
            const debug = {
                kind,
                message: isAxios ? error.message : (error?.message ?? String(error)),
                code: isAxios ? (error.code ?? null) : (error?.code ?? null),
                url: isAxios ? (error.config?.url ?? null) : (error?.config?.url ?? null),
                method: isAxios ? (error.config?.method ?? null) : (error?.config?.method ?? null),
                baseURL: isAxios ? (error.config?.baseURL ?? null) : (error?.config?.baseURL ?? null),
                status,
                payload,
            }
            console.error('Failed to fetch products:', debug)

            return thunkAPI.rejectWithValue(
                payload || {
                    message: debug.message || 'Failed to fetch products',
                    status,
                    code: debug.code,
                    url: debug.url,
                    kind,
                }
            )
        }
   }
)

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: [],
        loading: false,
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
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.list = action.payload
                state.loading = false;
                state.lastFetched = Date.now();
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error;
                // Don't clear the list on error - keep existing products visible
                // state.list = [];
            })
    }
})

export const { setProduct, clearProduct } = productSlice.actions

export default productSlice.reducer