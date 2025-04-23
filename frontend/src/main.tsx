/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <ThemeProvider>
    <App />
    </ThemeProvider>
  // </React.StrictMode>,
)
