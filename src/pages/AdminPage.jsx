import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../store/authSlice'
import { fetchUsersWithRoles, updateUserRoles, fetchRoles, createRole, deleteRole, selectAllUsers, selectAvailableRoles, selectAdminStatus, selectAdminError } from '../store/adminSlice'
import { Link } from '../components/Link.jsx'

export function AdminPage() {
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const users = useSelector(selectAllUsers)
    const availableRoles = useSelector(selectAvailableRoles)
    const status = useSelector(selectAdminStatus)
    const error = useSelector(selectAdminError)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [selectedRoles, setSelectedRoles] = useState([])
    
    const handleEditRoles = (user) => {
        setEditingUser(user)
        setSelectedRoles(user.roles || [])
        setIsModalOpen(true)
    }

    const handleSaveRoles = () => {
        dispatch(updateUserRoles({ userId: editingUser.id, roles: selectedRoles }))
        setIsModalOpen(false)
        setEditingUser(null)
    }

    const toggleRole = (role) => {
        setSelectedRoles(prev => 
            prev.includes(role) 
                ? prev.filter(r => r !== role) 
                : [...prev, role]
        )
    }

    const handleCreateRole = () => {
        const roleName = prompt('Enter new role name:')
        if (roleName) {
            dispatch(createRole(roleName.trim().toLowerCase()))
        }
    }

    const handleDeleteRole = (roleId) => {
        if (window.confirm(`Are you sure you want to delete the role "${roleId}"?`)) {
            dispatch(deleteRole(roleId))
        }
    }
    
    useEffect(() => {
        if (user && user.roles?.includes('admin')) {
            dispatch(fetchUsersWithRoles())
            dispatch(fetchRoles())
        }
    }, [dispatch, user])

    if (!user || !user.roles?.includes('admin')) {
        return (
            <section className="card">
                <h1>Access Denied</h1>
                <p>You do not have permission to view this page.</p>
                <Link to="/" className="btn">Return Home</Link>
            </section>
        )
    }

    return (
        <section className="card">
            <h1>Admin Dashboard</h1>
            <p className="lead">Welcome, {user.displayName || user.email}. This is the administration area.</p>
            
            <div className="grid">
                {/* Modal */}
                {isModalOpen && editingUser && (
                    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                        <div className="modal-content card" onClick={e => e.stopPropagation()}>
                            <h2>Edit Roles</h2>
                            <p className="muted">Managing roles for <strong>{editingUser.displayName || editingUser.email}</strong></p>
                            
                            <div className="modal-body">
                                <p style={{ marginBottom: '1rem' }}>Select roles to assign:</p>
                                <div className="role-options">
                                    {availableRoles.length > 0 ? (
                                        availableRoles.map(role => (
                                            <label key={role} className="role-option">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedRoles.includes(role)}
                                                    onChange={() => toggleRole(role)}
                                                />
                                                <span style={{ textTransform: 'uppercase', fontSize: '14px', fontWeight: '600' }}>{role}</span>
                                            </label>
                                        ))
                                    ) : (
                                        <p className="muted italic">No roles available in the system.</p>
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button className="btn-link" onClick={() => setIsModalOpen(false)} style={{ color: 'var(--muted)', textDecoration: 'none' }}>Cancel</button>
                                <button className="btn" onClick={handleSaveRoles}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="panel" style={{ gridColumn: '1 / -1' }}>
                    <h2>Member List</h2>
                    {status === 'loading' && <p>Loading users...</p>}
                    {status === 'failed' && <p className="error-msg">{error}</p>}
                    {status === 'succeeded' && (
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Roles</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.displayName || 'N/A'}</td>
                                            <td>{u.email}</td>
                                            <td>
                                                {u.roles && u.roles.length > 0 
                                                    ? u.roles.map(role => (
                                                        <span key={role} className="role-badge">{role}</span>
                                                      ))
                                                    : <span className="muted">No roles</span>
                                                }
                                            </td>
                                            <td>
                                                <button 
                                                    className="btn-link" 
                                                    onClick={() => handleEditRoles(u)}
                                                >
                                                    Edit Roles
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="panel">
                    <h2>System Overview</h2>
                    <p>Manage lodge members, roles, and website content from here.</p>
                    <div className="muted" style={{ marginTop: '1rem' }}>
                        Feature development in progress...
                    </div>
                </div>
                
                <div className="panel">
                    <h2>Manage Roles</h2>
                    <p>Create or delete available system roles.</p>
                    <div style={{ marginTop: '1rem' }}>
                        {availableRoles.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                {availableRoles.map(role => (
                                    <div key={role} className="role-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingRight: '4px' }}>
                                        {role}
                                        <button 
                                            onClick={() => handleDeleteRole(role)}
                                            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', padding: '0 2px' }}
                                            title={`Delete ${role} role`}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="muted">No roles defined in the system.</p>
                        )}
                        <button className="btn" onClick={handleCreateRole}>Create New Role</button>
                    </div>
                </div>

                <div className="panel">
                    <h2>Quick Actions</h2>
                    <ul style={{ paddingLeft: '1.2rem' }}>
                        <li>View Member List</li>
                        <li>Update Dues Information</li>
                        <li>Manage Roles</li>
                    </ul>
                </div>
            </div>
        </section>
    )
}
