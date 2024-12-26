import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Navbar from "./components/Navbar";
import Home from './pages/Home';
import store,{ persistor } from './store/store/store';
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import Teaching from "./pages/Teaching";
import RegisterSkills from "./pages/Registerskills";
import { PersistGate } from 'redux-persist/integration/react';
import HowItWorks from "./pages/HowItworks";
import ClassListingPage from "./pages/ClassListingPage";
import TutorPage from "./pages/Tutorpage";
import Blog from "./pages/Blog";

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

            </Routes>
          </div>
        </div>
        
      </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;