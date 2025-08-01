import React, { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { assets } from '../assets/assets';

const Queue = () => {
    const { 
        queue, 
        removeFromQueue, 
        clearQueue, 
        playFromQueue, 
        currentQueueIndex,
        track,
        toggleQueue
    } = useContext(PlayerContext);

    if (queue.length === 0) {
        return (
            <div className="fixed right-0 top-0 h-full w-80 bg-[#282828] text-white p-4 z-50">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Queue</h2>
                    <button 
                        onClick={toggleQueue} 
                        className="text-gray-400 hover:text-white"
                    >
                        ×
                    </button>
                </div>
                <div className="text-center text-gray-400 mt-8">
                    <p>Your queue is empty</p>
                    <p className="text-sm mt-2">Add songs to your queue to see them here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-[#282828] text-white p-4 z-50 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Queue</h2>
                <div className="flex gap-2">
                    <button 
                        onClick={clearQueue}
                        className="text-gray-400 hover:text-white text-sm"
                    >
                        Clear
                    </button>
                    <button 
                        onClick={toggleQueue} 
                        className="text-gray-400 hover:text-white"
                    >
                        ×
                    </button>
                </div>
            </div>

            {/* Currently Playing */}
            {track && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Now Playing</h3>
                    <div className="flex items-center gap-3 p-2 bg-[#404040] rounded">
                        <img 
                            src={track.image} 
                            alt={track.name} 
                            className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{track.name}</p>
                            <p className="text-gray-400 text-xs truncate">{track.desc}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Queue */}
            <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Next Up</h3>
                <div className="space-y-2">
                    {queue.map((song, index) => (
                        <div 
                            key={`${song._id}-${index}`}
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-[#404040] ${
                                index === currentQueueIndex ? 'bg-[#404040]' : ''
                            }`}
                            onClick={() => playFromQueue(index)}
                        >
                            <img 
                                src={song.image} 
                                alt={song.name} 
                                className="w-10 h-10 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{song.name}</p>
                                <p className="text-gray-400 text-xs truncate">{song.desc}</p>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromQueue(index);
                                }}
                                className="text-gray-400 hover:text-white text-lg"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Queue; 