import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Prediction from "./pages/Prediction.jsx";
import History from "./pages/History.jsx";
import Auth from "./pages/Auth.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
      <Route
        path="/prediction"
        element={
          <ProtectedRoute>
            <Prediction />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
