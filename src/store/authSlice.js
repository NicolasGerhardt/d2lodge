import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const signupUser = createAsyncThunk(
    'auth/signup',
    async ({ email, password, displayName }, { rejectWithValue }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const fbUser = userCredential.user;

            // Update Firebase Auth profile
            if (displayName) {
                await updateProfile(fbUser, { displayName });
            }

            const name = displayName || fbUser.email.split('@')[0];

            // Create firestore record
            await setDoc(doc(db, 'users', fbUser.uid), {
                uid: fbUser.uid,
                email: fbUser.email,
                displayName: name,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            // Pull down UserRoles
            const rolesDoc = await getDoc(doc(db, 'UserRoles', fbUser.uid));
            const roles = rolesDoc.exists() ? (rolesDoc.data()?.roles || []) : [];

            return { uid: fbUser.uid, email: fbUser.email, displayName: name, roles };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const fbUser = userCredential.user;

            // Pull down UserRoles
            const rolesDoc = await getDoc(doc(db, 'UserRoles', fbUser.uid));
            const roles = rolesDoc.exists() ? (rolesDoc.data()?.roles || []) : [];

            return { 
                uid: fbUser.uid, 
                email: fbUser.email, 
                displayName: fbUser.displayName, 
                roles
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await signOut(auth);
            return null;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

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
            if (state.status !== 'loading') {
                state.status = 'succeeded';
            }
        },
        clearUser: (state) => {
            state.user = null;
            if (state.status !== 'loading') {
                state.status = 'idle';
            }
        },
        setLoading: (state) => {
            state.status = 'loading';
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Signup
            .addCase(signupUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'succeeded';
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'succeeded';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.status = 'idle';
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { setUser, clearUser, setLoading, setError, resetStatus } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
