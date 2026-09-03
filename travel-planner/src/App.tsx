import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import TripPage from "./pages/TripPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/trip/:id"
          element={<TripPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;