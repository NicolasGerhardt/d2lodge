import {useDispatch} from "react-redux";
import {useState} from "react";
import {deletePost} from "../store/postsSlice.js";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Post({post, date, canEdit, onEdit}) {
    const dispatch = useDispatch();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            setIsDeleting(true);
            try {
                await dispatch(deletePost(post.id)).unwrap();
            } catch (err) {
                console.error('Failed to delete post:', err);
                setIsDeleting(false);
            }
        }
    };

    return (
        <div className="post">
            <div className="post-header">
                <h2>{post.title}</h2>
                <p className="post-date">published on {date} by {post.author} </p>
            </div>
            <hr/>
            <div className="post-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content}
                </ReactMarkdown>
            </div>
            {!post.published &&
                <p className="italic muted" style={{fontSize: '12px', marginTop: '10px', color: '#f00'}}>(Draft - Only
                    visible to admins/writers)</p>}
            {canEdit && (
                <div style={{display: 'flex', gap: '8px'}}>
                    <button className="btn-link" onClick={onEdit}>Edit</button>
                    <button className="btn-link" onClick={handleDelete} disabled={isDeleting}
                            style={{color: '#f87171'}}>
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            )}
        </div>
    );
}