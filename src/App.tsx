import { useState } from 'react';
import './styles/style.css';
import { TeamsSidebar } from './components/Sidebar/TeamsSidebar';
import { RightSidebar } from './components/Sidebar/RightSidebar';
import { ThreadList } from './components/Feed/ThreadList';
import { PostForm } from './components/Feed/PostForm';
import { Login } from './components/Login';
import { useAuth } from './hooks/useAuth';
import { useThreads } from './hooks/useSupabase';

function App() {
  const { user, profile, loading: authLoading } = useAuth();
  const [currentTeamId, setCurrentTeamId] = useState<number | null>(null);
  const { threads, loading: threadsLoading, error: threadsError, refetch } = useThreads(currentTeamId);

  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ color: 'var(--text-main)' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <header>
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="var(--accent)" />
            <path d="M16 8C11.5817 8 8 11.134 8 15C8 17.13 9.1165 19.035 10.875 20.25L10 24L14.25 22.125C14.8125 22.25 15.4062 22.3125 16 22.3125C20.4183 22.3125 24 19.1785 24 15.3125C24 11.4465 20.4183 8.3125 16 8.3125V8Z" fill="white" />
            <circle cx="16" cy="14" r="3" fill="var(--bg-dark)" />
          </svg>
          <span>Contact Team Manager</span>
        </div>
        <div className="header-search-container">
          <input type="text" className="input-field search-input" placeholder="検索 (CTRL+E)" />
        </div>
        <div className="user-profile">
          <div className="avatar" style={{ width: '28px', height: '28px' }}>
            {profile?.avatar_url ? <img src={profile.avatar_url} alt="" /> : (profile?.display_name || user.email)?.[0]}
          </div>
          <div>
            <span className="username" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>
              {profile?.display_name || user.email}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--accent)' }}>{profile?.role || 'User'}</span>
          </div>
        </div>
      </header>

      <div className="main-wrapper">
        <aside className="teams-sidebar">
          <div className="teams-list">
            <TeamsSidebar
              currentTeamId={currentTeamId}
              onSelectTeam={(id) => setCurrentTeamId(id)}
            />
          </div>
        </aside>

        <div className="dashboard-layout">
          <main className="main-feed-area">
            <div className="feed-list">
              <ThreadList
                currentTeamId={currentTeamId}
                threadsData={{ threads, loading: threadsLoading, error: threadsError, refetch }}
              />
            </div>
            <PostForm
              teamId={currentTeamId}
              onSuccess={() => refetch(true)}
            />
          </main>

          <RightSidebar
            currentTeamId={currentTeamId}
            threadsData={{ threads, loading: threadsLoading, error: threadsError, refetch }}
          />
        </div>
      </div>
    </>
  );
}

export default App;
