import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import InterviewPage from "./pages/InterviewPage";



function App() {

  return (

    <BrowserRouter>

      <Routes>

 <Route path="/" element={<LandingPage />} />

<Route path="/interview/:roomCode" element={<InterviewPage />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;