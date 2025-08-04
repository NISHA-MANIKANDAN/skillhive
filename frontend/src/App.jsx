import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Navbar from "./components/Navbar";
import Home from './pages/Home';
import store,{ persistor } from './store/store/store';
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import Teaching from "./pages/Teaching";
import RegisterSkills from "./pages/RegisterSkills";
import { PersistGate } from 'redux-persist/integration/react';
import HowItWorks from "./pages/HowItWorks";
import ClassListingPage from "./pages/ClassListingPage";
import TutorPage from "./pages/Tutorpage";
import Blog from "./pages/Blog";
import Footer from "./components/Footer";
import ProfilePage from "./pages/profile";
import AllSkills from "./components/AllSkills"
import LearningMenu from "./components/Learning/LearningMenu";
import UpdateProfile from "./components/Learning/UpdateProfile";
import CourseContentUpload from "./pages/CourseContentUpload";
import CourseContent from "./components/Teaching/CourseContent";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <div className="min-h-screen"> {/* Add a wrapper for full height */}
          <Navbar />
          <div className="pt-24  px-36"> {/* Add padding for fixed navbar */}
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path="/sign-up" element={<SignUp />} />
             <Route path="/sign-in" element={<Login />} />
             <Route path="/teaching-page" element={<Teaching />} />
             <Route path="/register-skills" element={<RegisterSkills />} />
             <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/classes" element={<ClassListingPage />} />
              <Route path="/tutorpage/:id" element={<TutorPage />} />
              <Route path="/blog" element={<Blog/>} />
              <Route path="/profile" element={<ProfilePage/>} /> 
              <Route path="/find-teachers" element={<AllSkills/>} /> 
              <Route path="/learning-page" element={<LearningMenu/>} /> 
             
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/course-content/:id" element={<CourseContentUpload />} />
              <Route path="/course-content-review/:id" element={<CourseContent />} />


            </Routes>
          </div>
          <Footer />
        </div>
        
      </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;