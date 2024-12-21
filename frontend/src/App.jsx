import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Navbar from "./components/Navbar";
import Home from './pages/Home';
import store from './store/store/store';
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import HowItWorks from "./pages/HowItWorks";
import Footer from './components/Footer'; // Import the Footer component
import Blog from "./pages/Blog";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen"> {/* Add a wrapper for full height */}
          <Navbar />
          <div className="pt-24 px-36"> {/* Add padding for fixed navbar */}
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-in" element={<Login />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/blog" element={<Blog />} />

            </Routes>
          </div>

          {/* Add Footer here to be displayed at the bottom of the page */}
          <Footer />
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
