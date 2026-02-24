import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitContactForm, resetStatus } from '../store/contactSlice';

export function ContactPage() {
    const dispatch = useDispatch();
    const { status: reduxStatus, error: reduxError } = useSelector(state => state.contact);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const isSubmitting = reduxStatus === 'loading';

    useEffect(() => {
        // Reset status when component mounts
        dispatch(resetStatus());
        return () => {
            // Optional: Reset status when component unmounts
            dispatch(resetStatus());
        };
    }, [dispatch]);

    useEffect(() => {
        if (reduxStatus === 'succeeded') {
            setFormData({ name: '', email: '', subject: '', message: '' });
        }
    }, [reduxStatus]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(submitContactForm(formData));
    };

    const statusDisplay = () => {
        if (reduxStatus === 'succeeded') {
            return { type: 'success', message: 'Thank you! Your message has been sent.' };
        }
        if (reduxStatus === 'failed') {
            return { type: 'error', message: reduxError || 'Something went wrong. Please try again later.' };
        }
        return null;
    };

    const display = statusDisplay();
    
    const subjects = ['General Inquiry', 'Membership', 'Dues Assistance', "Website Feature Request", 'Other'];

    return (
        <section className="card">
            <h1>Contact Us</h1>
            <p className="lead">Questions, updates, or dues help — reach out anytime.</p>

            <div className="grid grid-2-1">
                <div className="panel">
                    <h2>Send a Message</h2>
                    {display && (
                        <div className={display.type === 'success' ? 'success-msg' : 'error-msg'}>
                            {display.message}
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
                            <select
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="form-input"
                                required
                            >
                                <option value="" disabled>Select a subject</option>
                                {subjects.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
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
                    <h2>FYI</h2>
                    <p className="muted">
                        We typically respond to new inquiries within about a week. 
                        For a faster response, please include your full name and the specific details of your request.
                    </p>
                </div>
            </div>
        </section>
    )
}
