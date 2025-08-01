import React from 'react'
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddSong from './pages/AddSong/AddSong';
import ListSong from './pages/ListSong/ListSong';
import AddAlbum from './pages/AddAlbum/AddAlbum';
import ListAlbum from './pages/ListAlbum/ListAlbum';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import AdminLogin from './components/AdminLogin';
import { useAuth } from './context/AuthContext';

export const url = 'http://localhost:4000';

const App = () => {
  const { user, loading, logout } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className='min-h-screen bg-[#F3FFF7] flex items-center justify-center'>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <AdminLogin />;
  }

  return (
    <div className='flex items-start min-h-screen'>
      <ToastContainer />
      <Sidebar />
      <div className='flex-1 h-screen overflow-y-scroll bg-[#F3FFF7]'>
        <Navbar />
        <div className="pt-8 pl-5 sm:pt-12 sm:pl-12">
          {/* Admin info and logout button */}
          <div className="absolute top-4 right-4 z-50 flex items-center space-x-4">
            <div className="text-gray-700 text-sm">
              Admin: <span className="font-semibold">{user.username}</span>
              <span className="ml-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs">Admin</span>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Logout
            </button>
          </div>
          
          <Routes>
            <Route path="/add-song" element={<AddSong />} />
            <Route path="/list-songs" element={<ListSong />} />
            <Route path="/add-album" element={<AddAlbum />} />
            <Route path="/list-albums" element={<ListAlbum />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
