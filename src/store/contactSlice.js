import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const submitContactForm = createAsyncThunk(
    'contact/submitForm',
    async (formData, { rejectWithValue }) => {
        const url = import.meta.env.VITE_GOOGLE_SHEETS_URL;
        
        if (!url) {
            console.error('VITE_GOOGLE_SHEETS_URL is not defined in environment variables.');
            return rejectWithValue('Google Sheets URL is missing');
        }

        try {
            await fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain', // Use text/plain for no-cors to avoid preflight and header stripping
                },
                body: JSON.stringify(formData),
            });
            // With 'no-cors', we can't read the response (it's opaque), 
            // but if the network request itself doesn't throw, we assume it was sent.
            return { success: true };
        } catch (error) {
            console.error('Submission error:', error);
            return rejectWithValue(error.message || 'Network error occurred');
        }
    }
);

const contactSlice = createSlice({
    name: 'contact',
    initialState: {
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitContactForm.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(submitContactForm.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(submitContactForm.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { resetStatus } = contactSlice.actions;
export default contactSlice.reducer;
