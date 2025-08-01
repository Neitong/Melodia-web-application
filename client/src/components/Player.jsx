import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { PlayerContext } from '../context/PlayerContext'

const Player = () => {

    const {
        track, seekBar, seekBg, playStatus, play, pause, time, previous, next, seekSong,
        volume, handleVolumeChange, showQueue, toggleQueue
    } = useContext(PlayerContext);

    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

    const handleVolumeSliderChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        handleVolumeChange(newVolume);
    };

    const formatTime = (timeObj) => {
        const minutes = timeObj.minute.toString().padStart(2, '0');
        const seconds = timeObj.second.toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    // Close volume slider when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showVolumeSlider) {
                setShowVolumeSlider(false);
            }
        };

        if (showVolumeSlider) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showVolumeSlider]);

    return track ? (
        <div className='h-[10%] bg-black flex justify-between items-center text-white px-4'>
            <div className='hidden lg:flex items-center gap-4'>
                <img className='w-12' src={track.image} alt="" />
                <div>
                    <p>{track.name}</p>
                    <p>{track.desc.slice(0, 12)}</p>
                </div>
            </div>
            <div className='flex flex-col items-center gap-1 m-auto'>
                <div className='flex gap-4'>
                    <img className='w-4 cursor-pointer' src={assets.shuffle_icon} alt="" />
                    <img onClick={previous} className='w-4 cursor-pointer' src={assets.prev_icon} alt="" />
                    {playStatus
                        ? <img onClick={pause} className='w-4 cursor-pointer' src={assets.pause_icon} alt="" />
                        : <img onClick={play} className='w-4 cursor-pointer' src={assets.play_icon} alt="" />
                    }
                    <img onClick={next} className='w-4 cursor-pointer' src={assets.next_icon} alt="" />
                    <img className='w-4 cursor-pointer' src={assets.loop_icon} alt="" />
                </div>
                <div className='flex items-center gap-5'>
                    <p>{formatTime(time.currentTime)}</p>
                    <div ref={seekBg} onClick={seekSong} className='w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer'>
                        <hr ref={seekBar} className='h-1 border-none w-0 bg-green-800 rounded-full' />
                    </div>
                    <p>{track.duration}</p>
                </div>
            </div>
            <div className='hidden lg:flex items-center gap-2 opacity-75'>
                <img className='w-4' src={assets.plays_icon} alt="" />
                <img className='w-4' src={assets.mic_icon} alt="" />
                <img 
                    onClick={toggleQueue} 
                    className={`w-4 cursor-pointer ${showQueue ? 'opacity-100' : 'opacity-75'}`} 
                    src={assets.queue_icon} 
                    alt="" 
                />
                <img className='w-4' src={assets.speaker_icon} alt="" />
                <div className="relative">
                    <img 
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowVolumeSlider(!showVolumeSlider);
                        }}
                        className='w-4 cursor-pointer' 
                        src={assets.volume_icon} 
                        alt="" 
                    />
                    {showVolumeSlider && (
                        <div 
                            className="absolute bottom-8 right-0 bg-[#282828] p-3 rounded-lg shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeSliderChange}
                                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${volume * 100}%, #4D4D4D ${volume * 100}%, #4D4D4D 100%)`
                                }}
                            />
                            <div className="text-center text-xs mt-1">
                                {Math.round(volume * 100)}%
                            </div>
                        </div>
                    )}
                </div>
                <div className='w-20 bg-slate-50 h-1 rounded'>
                    <div 
                        className='h-full bg-green-500 rounded' 
                        style={{ width: `${volume * 100}%` }}
                    ></div>
                </div>
                <img className='w-4' src={assets.mini_player_icon} alt="" />
                <img className='w-4' src={assets.zoom_icon} alt="" />
            </div>
        </div>
    )
        : null
}

export default Player
