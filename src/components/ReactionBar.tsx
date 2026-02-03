import React, { useState } from 'react';

interface ReactionPickerProps {
    onSelect: (emoji: string) => void;
    onClose: () => void;
}

const COMMON_EMOJIS = ['👍', '❤️', '😊', '🎉', '👏', '🔥', '✅', '💯'];

export const ReactionPicker: React.FC<ReactionPickerProps> = ({ onSelect, onClose }) => {
    return (
        <div
            className="reaction-picker"
            style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                background: 'var(--bg-elevated, #2b2d31)', // Solid background
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                gap: '4px',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {COMMON_EMOJIS.map(emoji => (
                <button
                    key={emoji}
                    className="emoji-btn"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                    }}
                    onClick={() => {
                        onSelect(emoji);
                        onClose();
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
};

interface ReactionBarProps {
    reactions: Array<{
        id: string;
        emoji: string;
        user_id: string;
    }>;
    currentUserId?: string;
    onAdd: (emoji: string) => void;
    onRemove: (reactionId: string) => void;
    style?: React.CSSProperties;
}

export const ReactionBar: React.FC<ReactionBarProps> = ({
    reactions,
    currentUserId,
    onAdd,
    onRemove,
    style
}) => {
    const [showPicker, setShowPicker] = useState(false);

    // Group reactions by emoji
    const groupedReactions = reactions.reduce((acc, reaction) => {
        if (!acc[reaction.emoji]) {
            acc[reaction.emoji] = [];
        }
        acc[reaction.emoji].push(reaction);
        return acc;
    }, {} as Record<string, typeof reactions>);

    const handleReactionClick = (emoji: string, reactionsByEmoji: typeof reactions) => {
        const userReaction = reactionsByEmoji.find(r => r.user_id === currentUserId);
        if (userReaction) {
            onRemove(userReaction.id);
        } else {
            onAdd(emoji);
        }
    };

    return (
        <div
            className="reaction-bar"
            style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap', position: 'relative', ...style }}
            onMouseLeave={() => setShowPicker(false)}
        >
            {Object.entries(groupedReactions).map(([emoji, reactionList]) => {
                const hasUserReacted = reactionList.some(r => r.user_id === currentUserId);
                return (
                    <button
                        key={emoji}
                        className={`reaction-bubble ${hasUserReacted ? 'user-reacted' : ''}`}
                        style={{
                            background: hasUserReacted ? 'var(--accent-alpha)' : 'var(--bg-tertiary)',
                            border: `1px solid ${hasUserReacted ? 'var(--accent)' : 'var(--border-color)'}`,
                            borderRadius: '12px',
                            padding: '2px 8px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s'
                        }}
                        onClick={() => handleReactionClick(emoji, reactionList)}
                        title={`${reactionList.length} reaction${reactionList.length > 1 ? 's' : ''}`}
                    >
                        <span>{emoji}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {reactionList.length}
                        </span>
                    </button>
                );
            })}

            <div style={{ position: 'relative' }}>
                <button
                    className="add-reaction-btn"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        transition: 'all 0.2s',
                        display: 'grid',
                        placeItems: 'center',
                        lineHeight: '1',
                        padding: '0'
                    }}
                    onClick={() => setShowPicker(!showPicker)}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--accent)';
                        e.currentTarget.style.color = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                >
                    +
                </button>
                {showPicker && (
                    <ReactionPicker
                        onSelect={onAdd}
                        onClose={() => setShowPicker(false)}
                    />
                )}
            </div>
        </div>
    );
};
