import { Link } from '../components/Link.jsx'

export function DuesPage() {
    return (
        <section className="card">
            <h1>Pay Your Dues</h1>
            <p className="lead">
                Online dues payment is now being processed through Grandview Systems.
            </p>

            <div className="grid grid-2-1">
                <div className="panel">
                    <h2>How to Pay Online</h2>
                    <ol>
                        <li>
                            Visit the <a href="https://mi.grandview.systems/">Michigan Grandview Systems</a> portal.
                        </li>
                        <li>
                            Click <strong>Login</strong> in the top right corner.
                        </li>
                        <li>
                            If this is your first time using Grandview, click <strong>Sign Up</strong> to create your account.
                        </li>
                        <li>
                            When prompted:
                            <ul>
                                <li>Use <strong>2</strong> for the Lodge Number.</li>
                                <li>Enter your <strong>Member Number</strong> and <strong>Last Name</strong>.</li>
                                <li>Click <strong>Check Member Status</strong>.</li>
                            </ul>
                        </li>
                        <li>
                            Once logged in, there will be a prompt at the bottom of the page. Follow the on-screen instructions to complete your payment.
                        </li>
                    </ol>
                </div>
                <div className="panel callout">
                    <h2>Need a Hand?</h2>
                    <p>We&apos;re here to help! If you run into any trouble or just can&apos;t find your member number, feel free to reach out through our <Link to="/contact">Contact Us</Link> page.</p>
                </div>
            </div>
        </section>
    )
}
