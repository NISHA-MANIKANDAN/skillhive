import ErrorBoundary from "../components/Error";
import Header from "../components/Header";
import LiveLocationPage from "../components/Learning/Livelocation";
import TeachingHomePage from "../components/TeachingHomePage";
import Workflow from "../components/workflow";

const Home = () => {
  return (
    <div>
      <Header />
      <Workflow />
      <ErrorBoundary>
        <LiveLocationPage />
      </ErrorBoundary>
      <TeachingHomePage />
    </div>
  );
};

export default Home;
