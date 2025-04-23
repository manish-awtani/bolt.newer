/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router";

import './App.css'
import Home from './pages/Home';
import Builder from './pages/Builder';
import { useTheme } from './components/ThemeContext';
// import { parseXml } from "./steps";

function App() {
  // const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
