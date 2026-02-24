import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const fetchUsersWithRoles = createAsyncThunk(
    'admin/fetchUsersWithRoles',
    async (_, { rejectWithValue }) => {
        try {
            // Fetch all users
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const usersList = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Fetch all UserRoles
            const rolesSnapshot = await getDocs(collection(db, 'UserRoles'));
            const rolesMap = {};
            rolesSnapshot.docs.forEach(doc => {
                rolesMap[doc.id] = doc.data().roles;
            });

            // Merge roles into usersList
            const mergedList = usersList.map(user => ({
                ...user,
                roles: rolesMap[user.id] || []
            }));

            return mergedList;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUserRoles = createAsyncThunk(
    'admin/updateUserRoles',
    async ({ userId, roles }, { getState, rejectWithValue }) => {
        try {
            const { admin } = getState();
            const availableRoles = admin.availableRoles;
            
            // Validate roles
            const invalidRoles = roles.filter(r => !availableRoles.includes(r));
            if (invalidRoles.length > 0) {
                return rejectWithValue(`Invalid roles: ${invalidRoles.join(', ')}`);
            }

            await setDoc(doc(db, 'UserRoles', userId), { roles });
            return { userId, roles };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchRoles = createAsyncThunk(
    'admin/fetchRoles',
    async (_, { rejectWithValue }) => {
        try {
            const rolesSnapshot = await getDocs(collection(db, 'Roles'));
            return rolesSnapshot.docs.map(doc => doc.id);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createRole = createAsyncThunk(
    'admin/createRole',
    async (roleId, { rejectWithValue }) => {
        try {
            // Document ID is the role name
            await setDoc(doc(db, 'Roles', roleId), { createdAt: new Date().toISOString() });
            return roleId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteRole = createAsyncThunk(
    'admin/deleteRole',
    async (roleId, { rejectWithValue }) => {
        try {
            await deleteDoc(doc(db, 'Roles', roleId));
            return roleId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        availableRoles: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        resetAdminStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsersWithRoles.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUsersWithRoles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchUsersWithRoles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateUserRoles.fulfilled, (state, action) => {
                const { userId, roles } = action.payload;
                const user = state.users.find(u => u.id === userId);
                if (user) {
                    user.roles = roles;
                }
            })
            .addCase(fetchRoles.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.availableRoles = action.payload;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createRole.fulfilled, (state, action) => {
                if (!state.availableRoles.includes(action.payload)) {
                    state.availableRoles.push(action.payload);
                }
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.availableRoles = state.availableRoles.filter(r => r !== action.payload);
            });
    },
});

export const { resetAdminStatus } = adminSlice.actions;

export const selectAllUsers = (state) => state.admin.users;
export const selectAvailableRoles = (state) => state.admin.availableRoles;
export const selectAdminStatus = (state) => state.admin.status;
export const selectAdminError = (state) => state.admin.error;

export default adminSlice.reducer;
