import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    createPost,
    fetchAllPosts,
    fetchPublishedPosts,
    resetPostsStatus,
    selectAllPosts,
    selectPostsError,
    selectPostsStatus,
    updatePost
} from '../store/postsSlice';
import {selectUser} from '../store/authSlice';
import {Post} from "../components/Post.jsx";

export function PostsPage() {
    const dispatch = useDispatch();
    const posts = useSelector(selectAllPosts);
    const status = useSelector(selectPostsStatus);
    const error = useSelector(selectPostsError);
    const user = useSelector(selectUser);

    const isAdmin = user?.roles?.includes('admin');
    const isPostWriter = user?.roles?.includes('post writer');

    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        dispatch(resetPostsStatus());
    }, [dispatch, isAdmin, isPostWriter]);

    useEffect(() => {
        if (status === 'idle') {
            if (isAdmin || isPostWriter) {
                dispatch(fetchAllPosts());
            } else {
                dispatch(fetchPublishedPosts());
            }
        }
    }, [status, dispatch, isAdmin, isPostWriter]);

    const handleEditPost = (post) => {
        setEditingPost(post);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingPost(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <section className="card">
            <h1>News posts</h1>
            <p className="lead">
                This is where we will post news and updates.
            </p>

            {(isAdmin || isPostWriter) && (
                <PostUpsertForm
                    user={user}
                    postToEdit={editingPost} 
                    onCancel={editingPost ? handleCancelEdit : null} 
                />
            )}

            {status === 'loading' && <p>Loading posts...</p>}
            {status === 'failed' && <p className="error">Error: {error}</p>}
            {status === 'succeeded' && posts.length === 0 && <p>No posts available yet.</p>}

            <div className="posts-list">
                {posts.map(post => (
                    <Post 
                        key={post.id} 
                        post={post}
                        date={formatDate(post.publish_date)} 
                        canEdit={isAdmin || isPostWriter}
                        onEdit={() => handleEditPost(post)}
                    />
                ))}
            </div>
        </section>
    );
}

function PostUpsertForm({ user, postToEdit = null, onCancel = null }) {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    
    const getTodayDateStr = () => new Date().toISOString().split('T')[0];

    let initialFormData;
    initialFormData = {
        author: user?.displayName || '',
        title: '',
        content: '',
        publish_date: getTodayDateStr(),
        published: false
    };

    const [formData, setFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user && !postToEdit) {
            setFormData(prev => ({ ...prev, author: user.displayName || '' }));
        }
    }, [user, postToEdit]);

    useEffect(() => {
        if (postToEdit) {
            setFormData({
                author: postToEdit.author || user.displayName,
                title: postToEdit.title || '',
                content: postToEdit.content || '',
                publish_date: postToEdit.publish_date ? postToEdit.publish_date.split('T')[0] : getTodayDateStr(),
                published: postToEdit.published ?? false
            });
            setIsOpen(true);
        } else {
            setFormData(initialFormData);
            setIsOpen(false);
        }
    }, [initialFormData, postToEdit, user.displayName]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const dataToSubmit = {
                ...formData,
                publish_date: new Date(formData.publish_date).toISOString()
            };

            if (postToEdit) {
                await dispatch(updatePost({ id: postToEdit.id, ...dataToSubmit })).unwrap();
                if (onCancel) onCancel();
            } else {
                await dispatch(createPost(dataToSubmit)).unwrap();
                setFormData(initialFormData);
                setIsOpen(false);
            }
        } catch (err) {
            console.error('Failed to save post:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isEditMode = !!postToEdit;

    return (
        <div className="accordion">
            <button className="accordion-header" onClick={() => !isEditMode && setIsOpen(!isOpen)} disabled={isEditMode}>
                <span>{isEditMode ? 'Edit Post' : 'Create New Post'}</span>
                {!isEditMode && <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>▼</span>}
            </button>
            {isOpen && (
                <div className="accordion-content">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Author</label>
                            <input
                                className="form-input"
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Title</label>
                            <input 
                                className="form-input"
                                type="text" 
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Content (Markdown supported)</label>
                            <textarea 
                                className="form-input"
                                rows="8"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Write your post content here... You can use Markdown for formatting."
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>Publish Date</label>
                            <input 
                                className="form-input"
                                type="date"
                                value={formData.publish_date}
                                onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                />
                                {' '}Ready to Publish
                            </label>
                        </div>
                        <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Post' : 'Create Post')}
                            </button>
                            {isEditMode && (
                                <button className="btn" type="button" onClick={onCancel} disabled={isSubmitting}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

