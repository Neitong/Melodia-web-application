import { createContext, useEffect, useRef, useState, useCallback } from "react";
// import { songsData } from "../assets/assets";
import axios from 'axios'

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {

    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();
    const url = 'http://localhost:4000'

    const [songsData, setSongsData] = useState([]);
    const [albumsData,setAlbumData] = useState([]);
    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [volume, setVolume] = useState(1); // Volume state (0-1)
    const [showQueue, setShowQueue] = useState(false); // Queue visibility state
    const [queue, setQueue] = useState([]); // Queue of songs
    const [currentQueueIndex, setCurrentQueueIndex] = useState(0); // Current song index in queue
    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime: {
            second: 0,
            minute: 0
        }
    })

    // Volume control function
    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    }

    // Queue management functions
    const addToQueue = (song) => {
        setQueue(prevQueue => [...prevQueue, song]);
    }

    const removeFromQueue = (index) => {
        setQueue(prevQueue => prevQueue.filter((_, i) => i !== index));
    }

    const clearQueue = () => {
        setQueue([]);
        setCurrentQueueIndex(0);
    }

    const playFromQueue = (index) => {
        if (queue[index]) {
            setTrack(queue[index]);
            setCurrentQueueIndex(index);
            setPlayStatus(true); // Only set playStatus, let useEffect handle play()
        }
    }

    const toggleQueue = () => {
        setShowQueue(!showQueue);
    }

    // Auto-play next song when current song ends
    const handleSongEnd = useCallback(() => {
        // If we have a queue and there are more songs, play next
        if (queue.length > 0 && currentQueueIndex < queue.length - 1) {
            playFromQueue(currentQueueIndex + 1);
        } else if (queue.length > 0 && currentQueueIndex >= queue.length - 1) {
            // If we're at the end of the queue, clear it and stop
            clearQueue();
            setPlayStatus(false);
        } else {
            // If no queue, try to play next song from main list
            songsData.map(async (item, index) => {
                if (track._id === item._id && index < songsData.length - 1) {
                    await setTrack(songsData[index + 1]);
                    await audioRef.current.play();
                    setPlayStatus(true);
                } else if (track._id === item._id && index >= songsData.length - 1) {
                    // If we're at the end of the main list, stop
                    setPlayStatus(false);
                }
            });
        }
    }, [queue, currentQueueIndex, track, songsData]);

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true)
    }

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    }

    const playWithId = async (id) => {
        await songsData.map((item) => {
            if (id === item._id) {
                setTrack(item);
            }
        })
            ;
        await audioRef.current.play();
        setPlayStatus(true);
    }

    const previous = async () => {
        // If we have a queue, play from queue
        if (queue.length > 0 && currentQueueIndex > 0) {
            playFromQueue(currentQueueIndex - 1);
            return;
        }
        
        // Otherwise use the original logic
        songsData.map(async (item, index) => {
            if (track._id === item._id && index > 0) {
                await setTrack(songsData[index - 1]);
                await audioRef.current.play();
                setPlayStatus(true);
            }
        })
    }

    const next = async () => {
        // If we have a queue, play from queue
        if (queue.length > 0 && currentQueueIndex < queue.length - 1) {
            playFromQueue(currentQueueIndex + 1);
            return;
        }
        
        // Otherwise use the original logic
        songsData.map(async (item, index) => {
            if (track._id === item._id && index < songsData.length-1) {
                await setTrack(songsData[index + 1]);
                await audioRef.current.play();
                setPlayStatus(true);
            }
        })
    }

    const seekSong = async (e) => {
        audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration)
    }

    const getSongsData = async () => {
        const response = await axios.get(`${url}/api/song/list`);
        setSongsData(response.data.songs);
        console.log(response.data.songs);
        setTrack(response.data.songs[0])
    }

    const getAlbumsData = async () => {
        const response = await axios.get(`${url}/api/album/list`);
        setAlbumData(response.data.albums);
        console.log(response.data.albums);
    }

    useEffect(() => {
        setTimeout(() => {

            audioRef.current.ontimeupdate = () => {
                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + "%";
                setTime({
                    currentTime: {
                        second: Math.floor(audioRef.current.currentTime % 60),
                        minute: Math.floor(audioRef.current.currentTime / 60)
                    },
                    totalTime: {
                        second: Math.floor(audioRef.current.duration % 60),
                        minute: Math.floor(audioRef.current.duration / 60)
                    }
                })
            }

            // Add event listener for when song ends
            audioRef.current.onended = handleSongEnd;

        }, 1000);
    }, [handleSongEnd])

    useEffect(() => { 

        getSongsData()
        getAlbumsData()

     }, [])

    // Set initial volume when audio ref is available
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume, audioRef])

    // Play audio when track changes and playStatus is true
    useEffect(() => {
        if (audioRef.current && playStatus && track) {
            audioRef.current.load(); // Ensure the new src is loaded
            audioRef.current.play();
        }
    }, [track, playStatus]);

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track, setTrack,
        playStatus, setPlayStatus,
        volume, setVolume,
        showQueue, setShowQueue,
        queue, setQueue,
        currentQueueIndex, setCurrentQueueIndex,
        time, setTime,
        play, pause,
        playWithId,
        previous, next,
        seekSong,
        handleVolumeChange,
        addToQueue,
        removeFromQueue,
        clearQueue,
        playFromQueue,
        toggleQueue,
        songsData,albumsData
    }

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )

}

export default PlayerContextProvider;