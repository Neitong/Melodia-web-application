import React, { useContext, useState, useEffect } from 'react'
import { PlayerContext } from '../context/PlayerContext'

const SongItem = ({name, image, desc, id}) => {

    const { playWithId, addToQueue, songsData } = useContext(PlayerContext)
    const [showContextMenu, setShowContextMenu] = useState(false);

    const handlePlay = () => {
        playWithId(id);
    };

    const handleAddToQueue = () => {
        const song = songsData.find(song => song._id === id);
        if (song) {
            addToQueue(song);
        }
        setShowContextMenu(false);
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        setShowContextMenu(true);
    };

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showContextMenu) {
                setShowContextMenu(false);
            }
        };

        if (showContextMenu) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showContextMenu]);

    return (
        <div className="relative">
            <div 
                onClick={handlePlay} 
                onContextMenu={handleContextMenu}
                className='w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'
            >
                <div className="w-full h-[180px] mb-3">
                    <img 
                        className='w-full h-full rounded object-cover' 
                        src={image} 
                        alt={name} 
                    />
                </div>
                <div className="h-[60px] flex flex-col justify-start">
                    <p className='font-bold text-sm line-clamp-2 leading-tight'>{name}</p>
                    <p className='text-slate-200 text-xs line-clamp-2 leading-tight mt-1'>{desc}</p>
                </div>
            </div>
            
            {showContextMenu && (
                <div 
                    data-context-menu
                    className="absolute top-0 left-0 bg-[#282828] text-white rounded-lg shadow-lg z-50 min-w-[150px]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-2">
                        <button 
                            onClick={handlePlay}
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
        </div>
    )
}

export default SongItem
