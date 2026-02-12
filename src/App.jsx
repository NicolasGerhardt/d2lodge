import { useMemo  } from 'react'
import { ContactPage } from './pages/Contact.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { DuesPage } from './pages/Dues.jsx'
import { NotFoundPage } from './pages/NotFound.jsx'
import { NavLink } from './components/NavLink.jsx'
import { useHashRoute } from './hooks/useHashRoute.jsx'
import './App.css'


function App() {
    const route = useHashRoute()

    const Page = useMemo(() => {
        if (route === '/' || route === '') return HomePage
        if (route === '/contact') return ContactPage
        if (route === '/dues') return DuesPage
        return NotFoundPage
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
                    <NavLink to="/contact">Contact Us</NavLink>
                    <NavLink to="/dues">Pay Your Dues</NavLink>
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