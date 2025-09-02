import React, { useState, useRef, useEffect } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import ai from "../assets/ai.png";
import { RiMicAiFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from '../App';
import start from "../assets/start.mp3"

const SearchWithAi = () => {
    const startSound = new Audio(start)
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [recommendation, setRecommendation] = useState([]);
  const recognitionRef = useRef(null);

  function speak(message) {
    let utterance  = new SpeechSynthesisUtterance(message)
    window.speechSynthesis.speak(utterance)

  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
    } else {
      toast.error("SpeechRecognition is not supported in this browser");
    }
  }, []);

  const handleSearch = async () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
  
    recognition.start();
    startSound.play()

    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setInput(transcript);
      await handleRecommendation(transcript);
      console.log("Speech recognition event:", e);
    };
  };

const handleRecommendation = async (query) => {
  if (!query || query.trim() === "") {
    toast.error("Please provide a search query.");
    return;
  }

  try {
    const result = await axios.post(
      `${serverUrl}/api/course/search`,
      { query: query.trim() }, 
      { withCredentials: true }
    );
    console.log(result.data);
   if (result.data.results && result.data.results.length > 0) {
    speak("These are the Top courses I found for you");
} else {
    speak("No Courses Found");
}
setRecommendation(result.data.results);



    // use result.data.results as per your backend response
  } catch (error) {
    console.error("Recommendation fetch error:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to fetch recommendations.");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center px-4 py-1">
      <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center relative">
        <FaArrowLeftLong
          className="text-black w-[22px] h-[22px] cursor-pointer absolute left-4 top-4"
          onClick={() => navigate(-1)}
        />

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-6 flex items-center justify-center gap-2">
          <img src={ai} alt="AI" className="w-8 h-8" />
          Search With <span className="text-[#CB99C7]">AI</span>
        </h1>

        <div className="flex items-center bg-gray-700 rounded-full overflow-hidden shadow-lg relative w-full">
          <input
            type="text"
            className="flex-grow px-4 py-3 bg-transparent text-black placeholder-gray-400 focus:outline-none text-sm sm:text-base"
            placeholder="What do you want to learn? (e.g. AI, MERN, Cloud...)"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />

          <button className="absolute right-14 sm:right-16 bg-white rounded-full">
            <img src={ai}
             alt="" 
            className="w-10 h-10 p-2 rounded-full" 
             onClick={() => handleRecommendation(input)}
             
             />
          </button>

          <button
            className="absolute right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center"
            onClick={handleSearch}
          >
            <RiMicAiFill className="w-5 h-5 text-[#cb87c5]" />
          </button>
        </div>
      </div>

    
{recommendation.length > 0 ? (
  <div>
    {recommendation.map((course) => (
      <div
        key={course._id}
        onClick={() => navigate(`/viewCourse/${course._id}`)}
        className="bg-gray-800 p-4 rounded-xl mb-3 cursor-pointer hover:bg-gray-700 transition"
      >
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-40 object-cover rounded-lg mb-2"
        />
        <h2 className="text-lg font-bold">{course.title}</h2>
        <p className="text-sm text-gray-300">{course.description}</p>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-400 mt-4">No courses found yet. Try searching!</p>
)}


    </div>
  );
};

export default SearchWithAi;
