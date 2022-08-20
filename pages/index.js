import Head from 'next/head'
import { useState,useEffect } from 'react'
import { getUserPlaylists, loginUrl, shuffle } from '../services/spotify'

export default function Home() {
  const [playLists, setPlayLists] = useState([]);
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (window.location.hash !== "") {
      setList();
    }
  }, []);

  const setList= async ()=>{
    let list = await getUserPlaylists();
    setPlayLists(list)
  }
  return (
    <div className='section'>
      <Head>
        <title>Spotify Playlist Shuffler</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {
        playLists.length === 0 && <a href={loginUrl}>Log in with Spotify</a>
      }

      <div>
        <ul>
          {playLists !== [] &&
          playLists.map((ele)=>{
            return <li onClick={()=>{shuffle(ele.id,ele.length,ele.name);setShowLoading(true)}} key= {ele.id}>{ele.name}</li>
          })
          }
        </ul>
      </div>
      {showLoading && 
      <div className="loader" id="loader">
        <div></div>
      </div>
      }
    </div>
  )
}
