import { createAsyncThunk,  createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchRatings = createAsyncThunk('rating/fetchRatings',
    async ( { getToken } , thunkAPI) => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/rating', {headers: {
                Authorization: `Bearer ${token}`}})
            return data ? data.ratings : []
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data)
        }
    }
)

// Fetch the current user's own ratings (for showing which products they've rated, etc.)
export const fetchUserRatings = createAsyncThunk(
    'rating/fetchUserRatings',
    async ({ getToken }, thunkAPI) => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/rating', {
                headers: { Authorization: `Bearer ${token}` },
            })
            return data?.ratings ?? []
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data)
        }
    }
)

const ratingSlice = createSlice({
    name: 'rating',
    initialState: {
        ratings: [],
        userRatings: [],
    },
    reducers: {
        addRating: (state, action) => {
            state.ratings.push(action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRatings.fulfilled, (state, action) => {
                state.ratings = action.payload
            })
            .addCase(fetchUserRatings.fulfilled, (state, action) => {
                state.userRatings = action.payload
            })
    }
})

export const { addRating } = ratingSlice.actions

export default ratingSlice.reducer