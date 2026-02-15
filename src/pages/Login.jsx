import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { selectUser, setError, setLoading } from '../store/authSlice'

export function LoginPage() {
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [localError, setLocalError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLocalError(null)
        dispatch(setLoading())
        try {
            await signInWithEmailAndPassword(auth, email, password)
            // onAuthStateChanged listener in App will populate Redux with the user
        } catch (err) {
            const msg = err?.message || 'Login failed'
            setLocalError(msg)
            dispatch(setError(msg))
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut(auth)
        } catch (err) {
            setLocalError(err?.message || 'Sign out failed')
        }
    }

    return (
        <section className="card">
            <h1>Member Login</h1>
            <p className="muted">Use your email and password to sign in.</p>

            {user ? (
                <div className="panel">
                    <p>You are signed in as <strong>{user.email}</strong>.</p>
                    <button className="btn" onClick={handleSignOut}>Sign Out</button>
                </div>
            ) : (
                <form className="panel" onSubmit={handleSubmit}>
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

                    {localError && (
                        <div className="error-msg">{localError}</div>
                    )}

                    <button type="submit" className="btn">Sign In</button>
                </form>
            )}
        </section>
    )
}
