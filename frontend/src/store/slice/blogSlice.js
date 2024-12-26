import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [
    { id: 1, name: "Tutoring" },
    { id: 2, name: "Music" },
    { id: 3, name: "Sports" },
    { id: 4, name: "Languages" },
    { id: 5, name: "Arts" },
    { id: 6, name: "Digital" },
  ],
  blogs: {
    1: [
      { title: "How to become a tutor and find students online", excerpt: "Tutoring is a rewarding and great job to have. You are not only helping students learn better..." },
      { title: "3 step guide to get more students with SEO", excerpt: "Tutoring is a crowded space. Here's how to grow your business..." },
      { title: "Top 10 tips for successful online tutoring", excerpt: "Learn how to make your online tutoring sessions engaging and productive..." },
      { title: "Best tools to enhance your tutoring experience", excerpt: "From virtual whiteboards to video conferencing tools, discover the best tutoring tools..." },
    ],
    2: [
      { title: "Discover the exciting world of online learning", excerpt: "Stream your class on social media platforms with Clascity's public class feature..." },
      { title: "10 ways to teach music theory effectively", excerpt: "Struggling to teach music theory? These strategies can help simplify the process for your students..." },
      { title: "How to build a successful online music school", excerpt: "Starting an online music school? Here's a step-by-step guide to help you succeed..." },
      { title: "The future of music education in the digital age", excerpt: "Technology is transforming music education. Learn about the tools and trends shaping the future..." },
    ],
    "3": [
      { title: "Meet Clascity - A Skill Sharing Platform", excerpt: "Clascity is created for everyone to share their talents and for those who..." },
      { title: "How to coach sports online effectively", excerpt: "From strategy discussions to fitness routines, here's how to make the most of online sports coaching..." },
      { title: "Top 5 exercises for athletes during off-season", excerpt: "Keep your fitness levels high even during the off-season with these essential exercises..." },
      { title: "How to develop teamwork in an online sports setting", excerpt: "Discover innovative ways to foster teamwork and collaboration in virtual sports training..." }
    ],
    "4": [
      { title: "Online lessons are now available on Clascity!", excerpt: "Since staying at home became the new normal, we have been receiving an increasing number of requests..." },
      { title: "5 tips for learning a new language effectively", excerpt: "Mastering a new language requires consistency and the right tools. Here’s how you can do it..." },
      { title: "The best apps for language learners", excerpt: "Discover the top-rated apps that make language learning interactive and enjoyable..." },
      { title: "How to improve your fluency in a foreign language", excerpt: "Learn practical tips to improve your fluency and confidence when speaking a foreign language..." }
    ],
    "5": [
      { title: "How to learn almost anything with AI", excerpt: "Ever felt overwhelmed by the sheer amount of information out there?" },
      { title: "5 beginner-friendly art styles to explore", excerpt: "Want to start drawing or painting? These styles are great for beginners..." },
      { title: "How to teach art online: Best practices", excerpt: "Teaching art online can be challenging, but these tips will make it easier for you and your students..." },
      { title: "The role of creativity in a digital world", excerpt: "Explore how art and creativity are evolving in the age of technology..." }
    ],
    "6": [
      { title: "Top 10 digital skills to master in 2024", excerpt: "Want to stay competitive in the job market? These are the digital skills you should focus on..." },
      { title: "How to teach coding to beginners", excerpt: "Coding can be intimidating for newcomers. Here are strategies to make it accessible and fun..." },
      { title: "Exploring the world of digital marketing", excerpt: "From SEO to social media, learn the basics of digital marketing in this comprehensive guide..." },
      { title: "The importance of cybersecurity in the digital age", excerpt: "As we become more connected, protecting data is more important than ever. Here's what you need to know..." }
    ]
  },
  selectedCategoryId: null, // Added to track the selected category ID
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    // Action to update the selected category ID
    selectCategory: (state, action) => {
      state.selectedCategoryId = action.payload;
    }
  },
});

export const { selectCategory } = blogSlice.actions; // Export the selectCategory action
export default blogSlice.reducer;