import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Cursor } from './components/Cursor/Cursor'
import { Navbar } from './components/Navbar/Navbar'
import { Scene } from './components/Scene/Scene'
import { Room } from './components/Room/Room'
import { MemoryToast } from './components/MemoryToast/MemoryToast'
import { Kindergarten } from './components/rooms/Kindergarten/Kindergarten'
import { Truancy } from './components/rooms/Truancy/Truancy'
import { DreamGarden } from './components/rooms/DreamGarden/DreamGarden'
import { Gym } from './components/rooms/Gym/Gym'
import { Final } from './components/rooms/Final/Final'
import { useCursorReactions } from './hooks/useCursorReactions'
import { MuseumIntro } from './components/MuseumIntro/MuseumIntro'
import { FloatingMemoryBtn } from './components/FloatingMemoryBtn/FloatingMemoryBtn'

export default function App() {
  const [introComplete, setIntroComplete] = useState(false)
  useCursorReactions()

  return (
    <BrowserRouter basename="/Anya_Roman_Empire/">
      {!introComplete && <MuseumIntro onComplete={() => setIntroComplete(true)} />}
      <Cursor />
      <Navbar />
      <Routes>
        <Route path="/" element={<Scene />} />
      </Routes>

      {/* Rooms — rendered outside Routes so they overlay the scene */}
      <Room id="kindergarten"><Kindergarten /></Room>
      <Room id="truancy" contentClassName="room-content--truancy"><Truancy /></Room>
      <Room id="garden" contentClassName="room-content--garden" noWallBg><DreamGarden /></Room>
      <Room id="sport" contentClassName="room-content--sport"><Gym /></Room>
      <Room id="final" contentClassName="room-content--final" bgImage="background/wall3.png"><Final /></Room>

      <MemoryToast />
      <FloatingMemoryBtn />
    </BrowserRouter>
  )
}
