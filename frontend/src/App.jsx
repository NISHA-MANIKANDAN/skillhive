import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import HowItWorks from "./pages/HowItWorks";
import Footer from "./components/Footer";
import store from "./store/store/store"; 
import ClassListingPage from "./pages/ClassListingPage"
import TutorPage from "./pages/TutorPage";


const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col"> 
          <Navbar /> 

          <main className="flex-1 pt-24 px-4 md:px-8 lg:px-36"> 
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-in" element={<Login />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/classes" element={<ClassListingPage />} />
              <Route path="/tutorpage/:id" element={<TutorPage />} />
              
            </Routes>
          </main>

          <Footer /> 
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
