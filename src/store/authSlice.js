import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.status = 'succeeded';
        },
        clearUser: (state) => {
            state.user = null;
            state.status = 'idle';
        },
        setLoading: (state) => {
            state.status = 'loading';
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        }
    },
});

export const { setUser, clearUser, setLoading, setError } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;

export default authSlice.reducer;
