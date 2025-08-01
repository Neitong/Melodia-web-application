import React, { useContext, useState, useEffect } from 'react'
import Navbar from './Navbar'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets';
import { PlayerContext } from '../context/PlayerContext';

const DisplayAlbum = ({album}) => {

    const {id} = useParams();
    const [albumData,setAlbumData] = useState("")
    const {playWithId,albumsData,songsData, addToQueue} = useContext(PlayerContext);
    const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, songId: null });
    
    useEffect(()=>{
      albumsData.map((item)=>{
        if (item._id === id) {
          setAlbumData(item);
        }
      })
    },[])

    const handleSongClick = (songId) => {
        playWithId(songId);
    };

    const handleContextMenu = (e, songId) => {
        e.preventDefault();
        setContextMenu({
            show: true,
            x: e.clientX,
            y: e.clientY,
            songId
        });
    };

    const handleAddToQueue = () => {
        const song = songsData.find(song => song._id === contextMenu.songId);
        if (song) {
            addToQueue(song);
        }
        setContextMenu({ show: false, x: 0, y: 0, songId: null });
    };

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (contextMenu.show) {
                setContextMenu({ show: false, x: 0, y: 0, songId: null });
            }
        };

        if (contextMenu.show) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [contextMenu.show]);

  return albumData ? (
    <>
      <Navbar/>
      <div className='mt-10 flex gap-8 flex-col md:flex-row md:items-end'>
        <img className='w-48 rounded' src={albumData.image} alt="" />
        <div className='flex flex-col'>
            <p>Playlist</p>
            <h2 className='text-5xl font-bold mb-4 md:text-7xl'>{albumData.name}</h2>
            <h4>{albumData.desc}</h4>
            <p className='mt-1'>
                <img className='inline-block w-5 mr-1' src={assets.spotify_logo} alt="" />
                <b>Spotify</b>
                • 1,323,154 likes
                • <b>50 songs, </b>
                about 2 hr 30 min
            </p>
        </div>
      </div>
      <div className='grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]'>
        <p><b className='mr-4'>#</b>Title</p>
        <p>Album</p>
        <p className='hidden sm:block'>Date Added</p>
        <img className='m-auto w-4' src={assets.clock_icon} alt="" />
      </div>
      <hr />
      {
        songsData.filter((item)=>item.album === album.name).map((item,index)=>(
            <div 
                key={index}
                onClick={()=>handleSongClick(item._id)} 
                onContextMenu={(e) => handleContextMenu(e, item._id)}
                className='grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer'
            >
                <p className='text-white'>
                    <b className='mr-4 text-[#a7a7a7]'>{index+1}</b>
                    <img className='inline w-10 mr-5' src={item.image} alt="" />
                    {item.name}
                </p>
                <p className='text-[15px]'>{albumData.name}</p>
                <p className='text-[15px] hidden sm:block'>5 days ago</p>
                <p className='text-[15px] text-center'>{item.duration}</p>
            </div>
        ))
      }

      {/* Context Menu */}
      {contextMenu.show && (
        <div 
            data-context-menu
            className="fixed bg-[#282828] text-white rounded-lg shadow-lg z-50 min-w-[150px]"
            style={{ 
                left: contextMenu.x, 
                top: contextMenu.y,
                transform: 'translate(-50%, -100%)'
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="p-2">
                <button 
                    onClick={() => {
                        handleSongClick(contextMenu.songId);
                        setContextMenu({ show: false, x: 0, y: 0, songId: null });
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#404040] rounded text-sm"
                >
                    Play
                </button>
                <button 
                    onClick={handleAddToQueue}
                    className="w-full text-left px-3 py-2 hover:bg-[#404040] rounded text-sm"
                >
                    Add to Queue
                </button>
            </div>
        </div>
      )}
    </>
  ) : null
}

export default DisplayAlbum
