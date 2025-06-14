import logo from './logo.svg';
import './App.css';
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from './components/Home.js'
import Movie from './components/Movie.js'
import Login from './components/Login.js'
import Signup from './components/Signup.js'
import Logout from './components/Logout.js';
import Test from './components/Test.js'
import Profile from './components/Profile.js';

function App() {
  return (
    <HashRouter basename='/'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/movie/:movieId" element={<Movie />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />

      </Routes>
    </HashRouter>
  );
}

export default App;