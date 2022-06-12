import config from "./resources/config.json";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import { LoginProvider } from "./contexts/login.context";
import LoginPage from "./pages/login-page";

const Home = (props) => {
  return <div>Hello There</div>;
};

function App() {
  return (
    <LoginProvider config={config.gitlab_oauth_config}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </LoginProvider>
  );
}

export default App;
