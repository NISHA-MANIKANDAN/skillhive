import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Navbar from "./components/Navbar";
import Home from './pages/Home';
import store from './store/store/store';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen"> {/* Add a wrapper for full height */}
          <Navbar />
          <div className="pt-24"> {/* Add padding for fixed navbar */}
            <Routes>
              <Route path='/' element={<Home />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;