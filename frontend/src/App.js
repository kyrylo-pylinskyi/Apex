import Navbar from "./components/navbar/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ConfirmEmail from "./pages/ConfirmEmail";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";

function App() {
  console.log(process.env.REACT_APP_SERVER)
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
