import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SiViaplay } from 'react-icons/si';
import Nav from "../component/Nav";
import home1 from '../assets/home1.jpg';
import searchAi from '../assets/SearchAi.png';
import Logos from '../component/logos';
import ExploreCourses from '../component/ExploreCourses';
import CardPage from '../component/CardPage';
import About from '../component/About';
import Footer from '../component/Footer';

const Home = () => {
  const navigate = useNavigate();

  const handleCoursesClick = () => {
    navigate('/courses');
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Parent div with relative positioning */}
      <div className='w-full lg:h-[140vh] h-[70vh] relative'>

        <Nav />

        {/* Background image */}
        <img 
          src={home1} 
          alt='Home' 
          className='w-full h-[50vh] lg:h-full object-cover md:object-fill' 
        />

        {/* Headings */}
        <span className='absolute top-[15%] lg:top-[10%] w-full flex items-center justify-center text-white font-bold text-[20px] md:text-[40px] lg:text-[70px] text-center px-4'>
          Grow Your Skills to Advance
        </span>

        <span className='absolute top-[20%] lg:top-[18%] w-full flex items-center justify-center text-white font-bold text-[20px] md:text-[40px] lg:text-[70px] text-center px-4'>
          Your Career Path
        </span>

        {/* Buttons */}
        <div className='absolute top-[75%] md:top-[80%] lg:top-[30%] w-full flex flex-col md:flex-row items-center justify-center gap-4 px-4'>
          {/* ALL Courses Button */}
          <button
            onClick={()=>navigate("/allcourses")}
            className='flex items-center gap-2 px-6 py-3 border-2 border-white bg-black text-white rounded-lg text-lg font-medium hover:bg-white hover:text-black transition-all duration-300 w-full md:w-auto justify-center'
          >
            <SiViaplay size={20} /> ALL Courses
          </button>

          {/* Search With AI Button */}
          <button
            className='flex items-center gap-2 px-6 py-3 border-2 border-white bg-black text-white rounded-lg text-lg font-medium hover:bg-white hover:text-black transition-all duration-300 w-full md:w-auto justify-center' onClick={()=>navigate("/Search")}
          >
            <img src={searchAi} alt="Search AI" className='w-5 h-5' /> Search With AI
          </button>
        </div>
      </div>
      <Logos />
      <ExploreCourses />
      <CardPage />
      <About />
      <Footer />

    </div>
  );
};

export default Home;
