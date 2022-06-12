import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import { protect } from "@/components/protected-route/protected-route.component";
import { LoginProvider } from "@/contexts/login.context";
import Home from "@/pages/home-page";
import LoginPage from "@/pages/login-page";

function App() {
  return (
    <LoginProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={protect(<Home />)} />
        </Routes>
      </BrowserRouter>
    </LoginProvider>
  );
}

export default App;
