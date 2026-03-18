import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp,
    Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Helper to convert Firestore Timestamp to ISO string for Redux serializability
const serializeTimestamp = (timestamp) => {
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate().toISOString();
    }
    return timestamp;
};

export const fetchAllPosts = createAsyncThunk(
    'posts/fetchAllPosts',
    async (_, { rejectWithValue }) => {
        try {
            const postsQuery = query(collection(db, 'posts'), orderBy('publish_date', 'desc'));
            const querySnapshot = await getDocs(postsQuery);
            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    publish_date: serializeTimestamp(data.publish_date),
                    createdAt: serializeTimestamp(data.createdAt),
                    updatedAt: serializeTimestamp(data.updatedAt),
                };
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPublishedPosts = createAsyncThunk(
    'posts/fetchPublishedPosts',
    async (_, { rejectWithValue }) => {
        try {
            const postsQuery = query(
                collection(db, 'posts'), 
                where('published', '==', true),
                where('publish_date', '<=', Timestamp.now()),
                orderBy('publish_date', 'desc')
            );
            const querySnapshot = await getDocs(postsQuery);
            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    publish_date: serializeTimestamp(data.publish_date),
                    createdAt: serializeTimestamp(data.createdAt),
                    updatedAt: serializeTimestamp(data.updatedAt),
                };
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createPost = createAsyncThunk(
    'posts/createPost',
    async (postData, { rejectWithValue }) => {
        try {
            const now = new Date().toISOString();
            // Convert publish_date string to Firestore Timestamp
            const publishDate = postData.publish_date ? Timestamp.fromDate(new Date(postData.publish_date)) : Timestamp.now();
            
            const docRef = await addDoc(collection(db, 'posts'), {
                ...postData,
                publish_date: publishDate,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            return { 
                id: docRef.id, 
                ...postData,
                createdAt: now,
                updatedAt: now,
                publish_date: publishDate.toDate().toISOString()
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updatePost = createAsyncThunk(
    'posts/updatePost',
    async ({ id, ...postData }, { rejectWithValue }) => {
        try {
            const now = new Date().toISOString();
            const postRef = doc(db, 'posts', id);
            
            // Convert publish_date string to Firestore Timestamp if present
            const updateData = {
                ...postData,
                updatedAt: serverTimestamp(),
            };
            
            if (postData.publish_date) {
                updateData.publish_date = Timestamp.fromDate(new Date(postData.publish_date));
            }

            await updateDoc(postRef, updateData);
            
            return { 
                id, 
                ...postData,
                updatedAt: now,
                publish_date: updateData.publish_date ? updateData.publish_date.toDate().toISOString() : postData.publish_date
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async (postId, { rejectWithValue }) => {
        try {
            await deleteDoc(doc(db, 'posts', postId));
            return postId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        resetPostsStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPosts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAllPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchAllPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchPublishedPosts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPublishedPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchPublishedPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                const index = state.items.findIndex(post => post.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...action.payload };
                }
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.items = state.items.filter(post => post.id !== action.payload);
            });
    }
});

export const { resetPostsStatus } = postsSlice.actions;

export const selectAllPosts = (state) => state.posts.items;
export const selectPostsStatus = (state) => state.posts.status;
export const selectPostsError = (state) => state.posts.error;

export default postsSlice.reducer;
