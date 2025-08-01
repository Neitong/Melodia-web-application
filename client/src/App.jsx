import { useContext, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Player from './components/Player'
import Display from './components/Display'
import Queue from './components/Queue'
import Login from './components/Login'
import { PlayerContext } from './context/PlayerContext'
import { useAuth } from './context/AuthContext'

const App = () => {
  const { audioRef, track, songsData, showQueue } = useContext(PlayerContext);
  const { user, loading, logout } = useAuth();

  // Global click handler to close context menus
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // Close any open context menus
      const contextMenus = document.querySelectorAll('[data-context-menu]');
      contextMenus.forEach(menu => {
        if (!menu.contains(e.target)) {
          menu.style.display = 'none';
        }
      });
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className='h-screen bg-black flex items-center justify-center'>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <Login />;
  }

  return (
    <div className='h-screen bg-black'>
      {/* User info and logout button */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-4">
        <div className="text-white text-sm">
          Welcome, <span className="font-semibold">{user.username}</span>
          {user.role === 'admin' && <span className="ml-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs">Artist</span>}
        </div>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Logout
        </button>
      </div>

      {
        songsData.length !== 0
          ? <>
            <div className='h-[90%] flex'>
              <Sidebar />
              <Display />
            </div>
            <Player />
            {showQueue && <Queue />}
          </>
          : ""
      }

      <audio ref={audioRef} src={track ? track.file : ""} preload='auto'></audio>
    </div>
  )
}

export default App
