export function HomePage() {
    return (
        <section className="card">
            <h1>Detroit #2</h1>
            <p className="lead">
                Welcome to the official site for our club. We’re glad you’re here.
            </p>

            <div className="grid">
                <div className="panel">
                    <h2>What you’ll find here</h2>
                    <ul>
                        <li>A general welcome message and quick info</li>
                        <li>How to contact us</li>
                        <li>How to pay dues (and what to do if online payment is unavailable)</li>
                    </ul>
                </div>

                <div className="panel">
                    <h2>Quick links</h2>
                    <ul>
                        <li><a href="https://mi.grandview.systems/">Michigan Masons Grandview Lodge lookup</a></li>
                        <li><a href="https://michiganmasons.org/">Grand Lodge of Michigan</a></li>
                    </ul>
                </div>
            </div>
        </section>
    )
}
