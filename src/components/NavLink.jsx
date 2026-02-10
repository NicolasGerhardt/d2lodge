export function NavLink({ to, children }) {
    const isActive =
        (window.location.hash || '#/') === `#${to}` ||
        ((window.location.hash === '' || window.location.hash === '#') && to === '/')

    return (
        <a className={`navLink ${isActive ? 'active' : ''}`} href={`#${to}`}>
            {children}
        </a>
    )
}
