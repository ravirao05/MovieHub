import logo from './logo.svg';
import './App.css';
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import Home from './components/Home.js'
import Movie from './components/Movie.js'
import Login from './components/Login.js'
import Signup from './components/Signup.js'
import Test from './components/Test.js'
import Logout from './components/Logout.js';
import ChangePassword from './components/ChangePassword.js'
import Profile from './components/Profile.js';
import EmailValidate from './components/EmailValidate.js';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:movieId" element={<Movie />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change_password" element={<ChangePassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/:username/:token" element={<EmailValidate />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/test" element={<Test />} />

      </Routes>
    </HashRouter>
  );
}

export default App;