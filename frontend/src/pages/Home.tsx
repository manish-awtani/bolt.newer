/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wand2 } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useTheme } from "../components/ThemeContext";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();


  // useEffect(() => {
  //   document.documentElement.classList.toggle("dark", isDarkMode);
    
  // }, [isDarkMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate("/builder", { state: { prompt } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-neutral-100 to-gray-300 dark:from-gray-900 dark:to-black transition-all duration-300">
      <div className="absolute top-4 right-4">
        <button
          // onClick={() => {setIsDarkMode(!isDarkMode)

          // }
          // }
          onClick={toggleTheme}
          className="px-3 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-900"
        >
          Toggle {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
      </div>
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Wand2 className="w-12 h-12 text-blue-500 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Website AI Builder
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Describe your dream website, and we'll help you build it step by
            step
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex-col rounded-lg shadow-lg p-6 bg-white dark:bg-gray-800">
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the website you want to build..."
              className="w-full h-32 p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Generate Website Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
