import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/index.module.css'
import { useState, useEffect, useRef, use } from 'react'
import { FaPlay, FaStop } from 'react-icons/fa'

export default function Home() {
  const [images, setImages] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isOnTop, setIsOnTop] = useState(true)
  const [frameInterval, setFrameInterval] = useState(null)
  const counter = useRef(0)

  useEffect(() => {
    const main = document.querySelector('main')

    const importAll = (r) => {
      return r.keys().map(r);
    }

    setImages(importAll(require.context('../public/shrek/', false, /\.(png|jpe?g|svg)$/)))
    
    const handleEvent = (e) => {

      e.preventDefault()
      e.deltaY > 0 
        ? counter.current += 1
        : counter.current -= 1

      counter.current === 1 && setIsOnTop(false)
      counter.current === 0 && setIsOnTop(true)

      window.scrollTo(0, counter.current * document.querySelector("img").offsetHeight)
    }

    let timeout

    const handleMouseMove = () => {
      document.body.classList.remove('hide')
      if(timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        document.body.classList.add('hide')
      }, 2000)
    }

    main.addEventListener('scroll', handleEvent, false)
    main.addEventListener('mousewheel', handleEvent, false)
    main.addEventListener('touchmove', handleEvent, false)
    window.addEventListener('mousemove', handleMouseMove)
  
    return () => {
      main.removeEventListener('scroll', handleEvent, false)
      main.removeEventListener('mousewheel', handleEvent, false)
      main.removeEventListener('touchmove', handleEvent, false)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handlePlay = (e) => {
    console.log("here")
    if(isPlaying) return

    setFrameInterval(setInterval(() => {
      counter.current += 1
      counter.current === 1 && setIsOnTop(false)

      window.scrollTo(0, counter.current * document.querySelector("img").offsetHeight)
    }, 200))

    setIsPlaying(true)
  }

  const handleStop = (e) => {
    if(!isPlaying) return

    const button = e.target
    button.disabled = true

    clearInterval(frameInterval)
    setFrameInterval(null)
    setIsPlaying(false)
  }

  const toNum = (x) => {
    return Number(x.default.src.split('out')[1].split('.')[0])
  }

  return (
    <>
      <Head>
        <title>The entire Shrek movie but its a website</title>
        <meta name="description" content="The entire Shrek movie but its a scrollable website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        display: "flex",
        flexDirection: "column"
      }}>
        <button className={`${styles.stopButton} ${!isPlaying ? styles.hidden : ''}`} onClick={handleStop}>
          <FaStop/>
        </button>
        <button className={`${styles.playButton} ${!isOnTop ? styles.onBot : ''} ${isPlaying ? styles.hidden : ''}`} onClick={handlePlay}>
          <FaPlay/>
        </button>
        {images.sort((a, b) => toNum(a) - toNum(b)).map((image, i) => <Image style={{
          width: "auto",
          height: "100vh",
          pointerEvents: "none"
        }} key={i} src={image} width="1280" height="720" alt="shrek image"/>)}
      </main>
    </>
  )
}
