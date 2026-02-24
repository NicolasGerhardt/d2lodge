import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { ContactPage } from './pages/Contact.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { DuesPage } from './pages/Dues.jsx'
import { AdminPage } from './pages/AdminPage.jsx'
import { NotFoundPage } from './pages/NotFound.jsx'
import { LoginPage } from './pages/Login.jsx'
import { NavLink } from './components/NavLink.jsx'
import { useHashRoute } from './hooks/useHashRoute.jsx'
import { auth, db } from './firebase'
import { setUser, clearUser, selectUser } from './store/authSlice'
import './App.css'


function App() {
    const route = useHashRoute()
    const dispatch = useDispatch()
    const user = useSelector(selectUser)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                // Fetch UserRoles
                let roles = null;
                try {
                    const rolesDoc = await getDoc(doc(db, 'UserRoles', fbUser.uid));
                    if (rolesDoc.exists()) {
                        roles = rolesDoc.data();
                    }
                } catch (err) {
                    console.error("Error fetching UserRoles:", err);
                }

                const { uid, email, displayName } = fbUser
                dispatch(setUser({ uid, email, displayName, roles }))
            } else {
                dispatch(clearUser())
            }
        })
        return () => unsub()
    }, [dispatch])

    const Page = useMemo(() => {
        switch (route.toLowerCase()) {
            case '': return HomePage
            case '/': return HomePage
            case '/contact': return ContactPage
            case '/dues': return DuesPage
            case '/login': return LoginPage
            case '/signup': return LoginPage
            case '/admin': return AdminPage
            default: return NotFoundPage
        }
    }, [route])

    return (
        <div className="appShell">
            <header className="siteHeader">
                <div className="brand">
                    <img src="/BigD.png" alt="Detroit Lodge #2 Logo" className="brandLogo" />
                    <div className="brandInfo">
                        <div className="brandTitle">Detroit Lodge #2</div>
                        <div className="brandSub">Free and Accepted Masons of Michigan</div>
                    </div>
                </div>

                <nav className="nav">
                    <NavLink to="/">Home</NavLink>
                    {user?.roles?.roles?.includes('admin') && (
                        <NavLink to="/admin">Admin</NavLink>
                    )}
                    <NavLink to="/contact">Contact Us</NavLink>
                    <NavLink to="/dues">Pay Your Dues</NavLink>
                    {user ? (
                        <NavLink to="/login">Log Out</NavLink>
                    ) : (
                        <NavLink to="/login">Login</NavLink>
                    )}
                </nav>
            </header>

            <main className="siteMain">
                <Page />
            </main>

            <footer className="siteFooter">
                <span className="muted">© {new Date().getFullYear()} Detroit #2</span>
            </footer>
        </div>
    )
}

export default App