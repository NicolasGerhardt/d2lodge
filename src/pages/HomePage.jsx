import { Link } from '../components/Link.jsx'

export function HomePage() {
    return (
        <section className="card">
            <h1>Detroit Lodge #2</h1>
            <p className="lead">Two Centuries of Tradition, a Lifetime of Fellowship</p>
            <div className="grid">
                <div className="panel">
                    <h2>Our History</h2>
                    <p>Detroit Lodge #2 has been a cornerstone of the community since 1821—well before Michigan was granted statehood in 1865. Our historic Masonic Temple in Detroit recently celebrated its 100th anniversary, representing over two centuries of rich tradition and service.</p>
                </div>

                <div className="panel">
                    <h2>Our Mission</h2>
                    <p>We are dedicated to promoting fellowship, charity, and community service. Throughout the year, we host various events that bring our members together and allow us to give back to the Detroit community.</p>
                </div>

                <div className="panel">
                    <h2>Quick links</h2>
                    <ul>
                        <li><a href="https://mi.grandview.systems/users/sign_in/">Michigan Masons Grandview Lodge lookup</a></li>
                        <li><a href="https://michiganmasons.org/">Grand Lodge of Michigan</a></li>
                    </ul>
                </div>

                <div className="panel callout">
                    <h2>Interested in Joining?</h2>
                    <p>We welcome individuals of good character who are committed to making a positive impact. Our requirements are straightforward, and we would love to share more about the process of becoming part of our lodge family.</p>
                    <p>Ready to take the next step? Visit our <Link to="/contact">Contact Us</Link> page and send us a brief message about yourself—we’d love to connect!</p>
                </div>
            </div>
        </section>
    )
}
