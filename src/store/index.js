import { configureStore } from '@reduxjs/toolkit';
import contactReducer from './contactSlice';
import authReducer from './authSlice';
import adminReducer from './adminSlice';
import postsReducer from './postsSlice';

export const store = configureStore({
    reducer: {
        contact: contactReducer,
        auth: authReducer,
        admin: adminReducer,
        posts: postsReducer,
    },
});
