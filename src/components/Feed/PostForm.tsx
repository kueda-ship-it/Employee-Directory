import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface PostFormProps {
    teamId: number | null;
    onSuccess?: () => void;
}

export const PostForm: React.FC<PostFormProps> = ({ teamId, onSuccess }) => {
    const { user, profile } = useAuth();
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async () => {
        if (!title.trim() || !contentRef.current?.innerText.trim()) {
            alert('タイトルと内容を入力してください。');
            return;
        }

        if (!user) return;

        setLoading(true);
        try {
            const authorName = profile?.display_name || user.email || 'Unknown';

            const { error } = await supabase.from('threads').insert([
                {
                    title,
                    content: contentRef.current.innerHTML,
                    author: authorName,
                    user_id: user.id,
                    team_id: teamId,
                    status: 'pending'
                }
            ]);

            if (error) throw error;

            setTitle('');
            if (contentRef.current) contentRef.current.innerHTML = '';
            if (onSuccess) onSuccess();

        } catch (error: any) {
            alert('投稿に失敗しました: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="static-form-container">
            <section className="form-container compact-form" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="件名..."
                        style={{ marginTop: 0, flex: 1 }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className="btn btn-outline"
                        title="ファイル添付"
                        style={{ padding: 0, width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                        disabled={loading}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                        </svg>
                        <input type="file" style={{ display: 'none' }} multiple />
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <div
                            ref={contentRef}
                            contentEditable
                            className="input-field rich-editor"
                            style={{ marginTop: 0, minHeight: '50px', width: '100%' }}
                            onInput={(e) => {
                                if (!e.currentTarget.innerText.trim() && !e.currentTarget.innerHTML) {
                                    // Fallback for placeholder effect if needed, but we removed placeholder attribute to fix lint
                                }
                            }}
                        />
                        <div className="attachment-preview-area"></div>
                        <div className="mention-list" style={{ bottom: '100%', top: 'auto', display: 'none' }}></div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        title="投稿"
                        style={{ padding: 0, width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0, marginBottom: '10px' }}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? '...' : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        )}
                    </button>
                </div>
            </section>
        </div>
    );
};
