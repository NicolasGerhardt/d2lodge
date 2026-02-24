export function Link({ to, children, ...props }) {
    return (
        <a href={`#${to}`} {...props}>
            {children}
        </a>
    )
}
