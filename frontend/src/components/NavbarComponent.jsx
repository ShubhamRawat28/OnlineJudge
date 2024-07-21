import React, { useState, useEffect } from "react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { DarkThemeToggle } from "flowbite-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const NavbarComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8000/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setUser(response.data.user);
        setName(response.data.firstname + " " + response.data.lastname);
        setEmail(response.data.email);
        setProfilePicture(response.data.profilePicture);
        setIsAuthenticated(true);
      })
      .catch(error => {
        console.error("There was an error fetching the user!", error);
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">JudgeMe</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <DarkThemeToggle className="w-10 m-3 rounded-full" />
        {isAuthenticated ? (
          <Dropdown
            arrowIcon={false}
            className="rounded-md mr-40 md:mt-0 md:ml-2 w-64 mt-4"
            label={
              <Avatar alt="User settings" img={profilePicture || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-xl">{name}</span>
            </Dropdown.Header>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <>
          <p className="flex mr-6">
            <p onClick={() => navigate('/login')} className="mt-4 mr-2 w-14 font-bold cursor-pointer  dark:text-gray-400 text-xl dark:hover:text-white text-gray-500 hover:text-blue-500">Login</p>
            <p className="mt-4 w-8 font-bold dark:text-gray-400 text-xl text-gray-500">Or</p>
            <p onClick={() => navigate('/register')} className="mt-4 mr-2 w-16 font-bold cursor-pointer  dark:text-gray-400 text-xl dark:hover:text-white text-gray-500 hover:text-blue-500">Register</p>
            </p>
          </>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" className={`text-xl ${location.pathname === "/" ? "active text-blue-500 border-blue-500 border-b-2  dark:text-white dark:border-gray-100 dark:border-b-2" : "hover:text-blue-500 hover:border-blue-500 hover:dark:text-white hover:dark:border-gray-100"}`}>Home</Navbar.Link>
        <Navbar.Link href="/problems" className={`block text-xl ${location.pathname === "/problems" ? "active text-blue-500 border-blue-500 border-b-2  dark:text-white dark:border-gray-100 dark:border-b-2" : ""}`}>Problems</Navbar.Link>
        <Navbar.Link href="/contests" className={`text-xl ${location.pathname === "/contests" ? "active text-blue-500 border-blue-500 border-b-2  dark:text-white dark:border-gray-100 dark:border-b-2" : ""}`}>Contests</Navbar.Link>
        <Navbar.Link href="/resources" className={`text-xl ${location.pathname === "/resources" ? "active text-blue-500 border-blue-500 border-b-2  dark:text-white dark:border-gray-100 dark:border-b-2" : ""}`}>Resources</Navbar.Link>
        <Navbar.Link href="/about" className={`text-xl ${location.pathname === "/about" ? "active text-blue-500 border-blue-500 border-b-2  dark:text-white dark:border-gray-100 dark:border-b-2" : ""}`}>About us</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
