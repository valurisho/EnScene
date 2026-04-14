import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MovieMain from './movieMain.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MovieMain/>
  </StrictMode>,
)
