import Navbar from "./components/navbar/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ConfirmEmail from "./pages/ConfirmEmail";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Company from "./pages/Company";
import MyContracts from "./pages/MyContracts";
import CompanyContracts from "./pages/CompanyContracts";
import Companies from "./pages/Companies";

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-company" element={<Company />} />
          <Route path="/my-contracts" element={<MyContracts />} />
          <Route path="/my-company-contracts" element={<CompanyContracts />} />
          <Route path="/companies-feed" element={<Companies />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
