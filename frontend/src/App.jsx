import React from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Problems from "./components/Problems";
import Home from "./components/Home";
import ProblemDetail from "./components/ProblemDetail";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Flowbite } from "flowbite-react";

function App() {
  return (
    <Flowbite>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetail/>} />
        {/* <Route path="/aboutus" element={<AboutUs setActive = "aboutus"/>} /> */}
        {/* <Route path="/contest" element={<Contest setActive = "contest"/>} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </BrowserRouter>
    </Flowbite>
  );
}

export default App;
