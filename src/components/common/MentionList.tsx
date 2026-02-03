import React from 'react';
import { MentionCandidate } from '../../hooks/useMentions';

interface MentionListProps {
    candidates: MentionCandidate[];
    activeIndex: number;
    onSelect: (candidate: MentionCandidate) => void;
    style?: React.CSSProperties;
}

export const MentionList: React.FC<MentionListProps> = ({ candidates, activeIndex, onSelect, style }) => {
    if (candidates.length === 0) return null;

    return (
    const listStyle: React.CSSProperties = {
            position: 'absolute',
            background: 'var(--bg-elevated, #2b2d31)',
            border: '1px solid var(--border-color, #444)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            zIndex: 1000,
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
            display: 'block',
            ...style
        };

    const itemStyle = (isActive: boolean): React.CSSProperties => ({
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        background: isActive ? 'var(--primary-alpha, rgba(100, 108, 255, 0.2))' : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
    });

    return (
        <div className="mention-list" style={listStyle}>
            {candidates.map((candidate, index) => (
                <div
                    key={`${candidate.type}-${candidate.id}`}
                    className={`mention-item ${index === activeIndex ? 'active' : ''}`}
                    style={itemStyle(index === activeIndex)}
                    onMouseDown={(e) => {
                        e.preventDefault(); // Prevent blur
                        onSelect(candidate);
                    }}
                >
                    <div className={`avatar ${candidate.type === 'tag' ? 'tag-avatar' : ''}`} style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: candidate.type === 'tag' ? 'var(--accent, #646cff)' : 'var(--bg-tertiary, #404040)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0
                    }}>
                        {candidate.type === 'tag' ? '#' : (
                            candidate.avatar ? (
                                <img src={candidate.avatar} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                candidate.display[0].toUpperCase()
                            )
                        )}
                    </div>
                    <div className="mention-info" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <span className="mention-name" style={{ fontWeight: 500, fontSize: '0.9rem' }}>{candidate.display}</span>
                        {candidate.sub && <span className="mention-email" style={{ fontSize: '0.75rem', color: 'var(--text-muted, #999)' }}>{candidate.sub}</span>}
                    </div>
                </div>
            ))}
        </div>
    );
    );
};
