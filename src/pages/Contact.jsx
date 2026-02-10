import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            await addDoc(collection(db, 'submissions'), {
                ...formData,
                timestamp: serverTimestamp()
            });
            setStatus({ type: 'success', message: 'Thank you! Your message has been sent.' });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus({ type: 'error', message: 'Something went wrong. Please try again later.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="card">
            <h1>Contact Us</h1>
            <p className="lead">Questions, updates, or dues help — reach out anytime.</p>

            <div className="grid">
                <div className="panel">
                    <h2>Send a Message</h2>
                    {status.message && (
                        <div className={status.type === 'success' ? 'success-msg' : 'error-msg'}>
                            {status.message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                className="form-input"
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Submit Message'}
                        </button>
                    </form>
                </div>

                <div className="panel">
                    <h2>Direct Contact</h2>
                    <p className="muted">
                        Tip: Include your full name and the reason you’re contacting us so we can respond faster.
                    </p>
                </div>
            </div>
        </section>
    )
}
