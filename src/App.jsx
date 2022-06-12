import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import { protect } from "./components/protected-route/protected-route.component";
import { LoginProvider } from "./contexts/login.context";
import LoginPage from "./pages/login-page";

const Home = (props) => {
  return <div>Hello There</div>;
};

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
