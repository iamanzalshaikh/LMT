// import Course from "../model/CoursesModel.js";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv"
// dotenv.config()

// export const searchWithAi = async (req, res) => {
//   try {
//     const { query } = req.body; // use a generic field name

//     if (!query || query.trim() === "") {
//       return res.status(400).json({ message: "Search query is required" });
//     }
// // Initialize Gemini with your API key
// const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function main() {
//   const prompt = `
// You are an intelligent assistant for an LMS platform. 
// A user will type any query about what they want to learn. 
// Your task is to understand the intent and return one **most relevant keyword** 
// from the following list of course categories and levels:
// - App Development
// - AI/ML
// - AI Tools
// - Data Science
// - Ethical Hacking
// - UI/UX Designing
// - Web Development
// - Others
// - Beginner
// - Intermediate
// - Advanced
// `;

//   const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

//   const result = await model.generateContent({
//     contents: [{ role: "user", parts: [{ text: prompt }] }],
//   });

//   const keyword = result.response.text().trim();
//   console.log("Extracted keyword:", keyword);
// }

// main().catch(console.error);

//     const courses = await Course.find({
//       isPublished: true,
//       $or: [
//         { title: { $regex: query, $options: "i" } },
//         { subtitle: { $regex: query, $options: "i" } },
//         { description: { $regex: query, $options: "i" } },
//         { level: { $regex: query, $options: "i" } },
//         { category: { $regex: query, $options: "i" } }
//       ]
//     });

//     if(courses.length > 0) {
//         return res.status(200).json(courses)
//     } else {
//          const courses = await Course.find({
//       isPublished: true,
//       $or: [
//         { title: { $regex: keyword, $options: "i" } },
//         { subtitle: { $regex: keyword, $options: "i" } },
//         { description: { $regex: keyword, $options: "i" } },
//         { level: { $regex: query, $keyword: "i" } },
//         { category: { $regex: query, $keyword: "i" } }
//       ]
//     });
//     }

//     return res.status(200).json({ success: true, results: courses });
//   } catch (error) {
//     console.error("AI Search Error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };


import Course from "../model/CoursesModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

export const searchWithAi = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const prompt = `
You are an intelligent assistant for an LMS platform.
A user will type any query about what they want to learn.
Your task is to understand the intent and return one **most relevant keyword**
from the following list of course categories and levels:
- App Development
- AI/ML
- AI Tools
- Data Science
- Ethical Hacking
- UI/UX Designing
- Web Development
- Others
- Beginner
- Intermediate
- Advanced

User query: ${query}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Get keyword from Gemini
    const result = await model.generateContent(prompt);
    const keyword = result.response.text().trim();
    console.log("Gemini keyword:", keyword);

    // First search with the original user query
    let courses = await Course.find({
      isPublished: true,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { subtitle: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { level: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ]
    });

    // If no results, search using Gemini keyword
   if (courses.length === 0 && keyword) {
  courses = await Course.find({
    isPublished: true,
    $or: [
      { title: { $regex: `${query}|${keyword}`, $options: "i" } },
      { subtitle: { $regex: `${query}|${keyword}`, $options: "i" } },
      { description: { $regex: `${query}|${keyword}`, $options: "i" } },
      { level: { $regex: `${query}|${keyword}`, $options: "i" } },
      { category: { $regex: `${query}|${keyword}`, $options: "i" } }
    ]
  });
}


    return res.status(200).json({ success: true, results: courses });
  } catch (error) {
    console.error("AI Search Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
