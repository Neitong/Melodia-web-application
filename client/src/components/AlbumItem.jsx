import React from 'react'
import { useNavigate } from 'react-router-dom'

const AlbumItem = ({image,name,desc,id}) => {

    const navigate = useNavigate()

  return (
    <div onClick={()=>navigate(`/album/${id}`)} className='w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
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
  )
}

export default AlbumItem
