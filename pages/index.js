import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/index.module.css'
import { useState, useEffect, useRef } from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'

export default function Home() {
  const [images, setImages] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [frameInterval, setFrameInterval] = useState(null)
  const [hideTimeOut, setHideTimeOut] = useState(false)
  const [counter, setCounter] = useState(1)
  const [isBeingDragged, setIsBeingDragged] = useState(false)
  const counterRef = useRef(1)

  useEffect(() => {
    const importAll = (r) =>  r.keys().map(r)
    setImages(importAll(require.context('/public/shrek/', false, /\.(png|jpe?g|svg)$/)))
  }, [])

  useEffect(() => {
    const pxToNum = (px) => Number(px.split('px')[0])

    const handleEvent = (e) => {
      if(e.type === "touchmove") {
        if(isBeingDragged) {
          return
        } else {
          e.preventDefault()
          return
        }
      }

      e.preventDefault()
      e.deltaY && e.deltaY > 0 
        ? setCounter(counter + 1)
        : setCounter(counter - 1)
    }

    const handleTouchEnd = () => {
      setIsBeingDragged(false)
    }

    const main = document.querySelector('main')
    const mainStyles = getComputedStyle(main)
    const gap = mainStyles.getPropertyValue('gap')

    window.scrollTo(0, counter * (document.querySelector("img")?.offsetHeight + pxToNum(gap)))
    
    counterRef.current = counter  

    main.addEventListener('scroll', handleEvent, false)
    main.addEventListener('mousewheel', handleEvent, false)
    main.addEventListener('touchmove', handleEvent, false)
    main.addEventListener('touchend', handleTouchEnd, false)
  
    return () => {
      main.removeEventListener('scroll', handleEvent, false)
      main.removeEventListener('mousewheel', handleEvent, false)
      main.removeEventListener('touchmove', handleEvent, false)
    }
  }, [counter, isBeingDragged])

  useEffect(() => {
    const handleMouseMove = () => {
      document.body.classList.remove('hide')
      if(hideTimeOut) clearTimeout(hideTimeOut)
      setHideTimeOut(setTimeout(() => {
        document.body.classList.add('hide')
      }, 2000))
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [hideTimeOut])

  const handlePlay = (e) => {
    if(isPlaying) return

    setFrameInterval(setInterval(() => {
      setCounter(counterRef.current + 1)
    }, 50))

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

  const toNum = (x) =>  Number(x.default.src.split('out')[1].split('.')[0])

  const handleSlider = ({ target }) => {
    setIsBeingDragged(true)
    setCounter(Number(target.value))
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
        <div className={styles.controlers}>
          <button className={`${styles.stopButton} ${!isPlaying ? styles.hidden : ''}`} onClick={handleStop}>
            <FaPause />
          </button>
          <button className={`${styles.playButton} ${isPlaying ? styles.hidden : ''}`} onClick={handlePlay}>
            <FaPlay />
          </button>
          <input className={styles.slider} min="0" max={images.length} value={counter} onChange={handleSlider} type="range"></input>
        </div>
        {images.sort((a, b) => toNum(a) - toNum(b)).map((image, i) => <Image priority style={{
          pointerEvents: "none"
        }} key={i} src={image} width="1280" height="720" alt="shrek image"/>)}
      </main>
    </>
  )
}
