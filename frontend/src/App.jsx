import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Navbar from "./components/Navbar";
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import store from './store/store/store';
import Footer from "./components/Footer";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {/* App Wrapper for consistent layout */}
        <div className="flex flex-col min-h-screen">
          {/* Fixed Navbar */}
          <Navbar />
          {/* Main Content */}
          <main className="flex-grow pt-24 px-36">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </main>
          {/* Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
