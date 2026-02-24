import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from '../components/Link.jsx'
import { selectUser, signupUser, loginUser, logoutUser, selectAuthStatus, selectAuthError, resetStatus } from '../store/authSlice'

export function LoginPage() {
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const status = useSelector(selectAuthStatus)
    const error = useSelector(selectAuthError)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [isSignup, setIsSignup] = useState(window.location.hash === '#/signup')

    useEffect(() => {
        const handleHashChange = () => {
            setIsSignup(window.location.hash === '#/signup')
            dispatch(resetStatus())
        }
        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [dispatch])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isSignup) {
            dispatch(signupUser({ email, password, displayName }))
        } else {
            dispatch(loginUser({ email, password }))
        }
    }

    const handleSignOut = () => {
        dispatch(logoutUser())
    }

    return (
        <section className="card">
            <h1>{isSignup ? 'Create Account' : 'Member Login'}</h1>
            <p className="muted">
                {isSignup 
                    ? 'Fill out the form below to register.' 
                    : 'Use your email and password to sign in.'}
            </p>

            {user ? (
                <div className="panel">
                    <p>You are signed in as <strong>{user.email}</strong>.</p>
                    <button className="btn" onClick={handleSignOut}>Sign Out</button>
                </div>
            ) : (
                <>
                    <div className="auth-tabs">
                        <Link to="/login" className={`auth-tab ${!isSignup ? 'active' : ''}`}>Sign In</Link>
                        <Link to="/signup" className={`auth-tab ${isSignup ? 'active' : ''}`}>Sign Up</Link>
                    </div>

                    <form className="panel" onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className="form-group">
                            <label htmlFor="displayName">Name</label>
                            <input
                                id="displayName"
                                className="form-input"
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required
                                placeholder="Your full name"
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            className="form-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            className="form-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Your password"
                        />
                    </div>

                    {error && (
                        <div className="error-msg">{error}</div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button type="submit" className="btn" disabled={status === 'loading'}>
                            {status === 'loading' ? 'Processing...' : (isSignup ? 'Sign Up' : 'Sign In')}
                        </button>
                    </div>
                </form>
                </>
            )}
            <p className="muted" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '13px' }}>
                Note: New accounts are manually reviewed by an administrator before additional site access is granted.
            </p>
        </section>
    )
}
