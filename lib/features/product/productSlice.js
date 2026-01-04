import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProducts = createAsyncThunk('products/fetchProducts', 
    async ({ storeId } = {}, thunkAPI) => {
        try {
            const url = '/api/products' + (storeId ? `?storeId=${encodeURIComponent(storeId)}` : '')
            const { data } = await axios.get(url)
            return data.products || []
        } catch (error) {
            // Axios network errors won't have `error.response`.
            const status = error?.response?.status ?? null
            const payload = error?.response?.data ?? null

            const debug = {
                message: error?.message,
                code: error?.code,
                url: error?.config?.url,
                method: error?.config?.method,
                baseURL: error?.config?.baseURL,
                status,
                payload,
            }
            console.error('Failed to fetch products:', debug)

            return thunkAPI.rejectWithValue(
                payload || {
                    message: error?.message || 'Failed to fetch products',
                    status,
                    code: error?.code || null,
                    url: error?.config?.url || null,
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
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.list = [];
            })
    }
})

export const { setProduct, clearProduct } = productSlice.actions

export default productSlice.reducer