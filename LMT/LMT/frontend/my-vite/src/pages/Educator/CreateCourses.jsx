// import axios from 'axios';
// import React, { useState } from 'react';
// import { FaArrowLeftLong } from 'react-icons/fa6';
// import { useNavigate } from 'react-router-dom';
// import { serverUrl } from '../../App';
// import { linkWithCredential } from 'firebase/auth';
// import { toast } from 'react-toastify';
// import { ClipLoader } from 'react-spinners';

// const CreateCourses = () => {
//     const [title , setTitle ] = useState("")
//     const[category , setCategory ] = useState("")
//     const[loading , setLoading ] = useState(false)


//     const handleCourse = async()=> {
//         setLoading
//         try {
//             const result = await axios.post(serverUrl + "/api/course/Create" , 
//                 {
//                     title,
//                     category,
//                 }, 
//                 {WithCredential : true})
//                 console.log(result.data)
//                 setLoading(false)
//                 toast.success("Course Created")

            
//         } catch (error) {
//             console.log(error)
//             toast.error(error.response.data.message)
            
//         }
//     }

//     const navigate = useNavigate()
//   return (
//     <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10'>
//         <div className='max-w-xl w-[600px] mx-auto p-6 bg-white shadow-md rounded-md mt-10 relative'>
//             <FaArrowLeftLong className='top-[8%] absolute left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/courses")}></FaArrowLeftLong>
//             <h2 className='text-2xl font-semibold mb-6 text-center'>
//                 Create Course
//             </h2>

//             <form className='space-y-5' onSubmit={(e)=>e.preventDefault}>
//                 <div>
//                     <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-1'>Course Title</label>
//                     <input type='text' id='title' placeholder='Enter Courses title' className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus-ring-2 focus:ring-[black] ' onChange={(e)=>setCategory(e.target.value)}> 
//                     </input>
//                 </div>
//                 <div>
//   <label
//     htmlFor="cat"
//     className="block text-sm font-medium text-gray-700 mb-1"
//   >
//     Course Category
//   </label>

//   <select
//     id="cat"
//     name="category"
//     className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
//     defaultValue=""
//     onChange={(e)=>setCategory(e.target.value)}
//   >
//     <option value="" disabled>
//       -- Select a Category --
//     </option>
//     <option value="Data Analytics">Data Analytics</option>
//     <option value="Ethical Hacking">Ethical Hacking</option>
//     <option value="UI UX Designing">UI/UX Designing</option>
//     <option value="Web Development">Web Development</option>
//     <option value="Other">Other</option>
//   </select>
// <button
//   className="w-full bg-black text-white py-2 px-4 rounded-md active:bg-[#3a3a3a] transition"
//   onClick={handleCourse}
//   disabled={loading} // optional: disables button while loading
// >
//   {loading ? <ClipLoader size={30} color="white" /> : "Start Course"}
// </button>

// </div>

//             </form>
//         </div>
//     </div>
//   )
// }

// export default CreateCourses;



import axios from 'axios';
import React, { useState } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const CreateCourses = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCourse = async () => {
    if (!title || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/course/create`,
        { title, category },
        { withCredentials: true } // fixed casing
      );
      console.log(result.data);
      toast.success("Course Created");
      setLoading(false);
      setTitle("");
      setCategory("");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="max-w-xl w-full mx-auto p-6 bg-white shadow-md rounded-md relative">
        <FaArrowLeftLong
          className="top-[8%] absolute left-[5%] w-[22px] h-[22px] cursor-pointer"
          onClick={() => navigate("/courses")}
        />
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Course
        </h2>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Course Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter Course title"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)} // fixed: was setCategory
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Course Category
            </label>
            <select
              id="category"
              name="category"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>
                -- Select a Category --
              </option>
              <option value="Data Analytics">Data Analytics</option>
              <option value="Ethical Hacking">Ethical Hacking</option>
              <option value="UI UX Designing">UI/UX Designing</option>
              <option value="Web Development">Web Development</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
  type="button"
  className="w-full bg-black text-white py-2 px-4 rounded-md active:bg-[#3a3a3a] transition"
  onClick={async () => {
    await handleCourse();   
    navigate("/courses");   
  }}
  disabled={loading}
>
  {loading ? <ClipLoader size={30} color="white" /> : "Create Course"}
</button>

        </form>
      </div>
    </div>
  );
};

export default CreateCourses;
