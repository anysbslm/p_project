import { Routes, Route, BrowserRouter, Navigate} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import React from "react";

// pages 
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from "./pages/NotFound";
import Status from "./pages/Status";
import Profile from "./pages/Profile";
import Linked_dev from "./pages/Linked_dev";
import Visualization from "./pages/Visualization";
// Components
import Navbar from "./components/Navbar";
import Sidebar from './components/Sidebar';

export default function App() {
  const { user } = useAuthContext()

  return (
    <BrowserRouter>
    <div style={{ display: 'flex' }}>
    <Navbar/>
    {user && <Sidebar />}
    <div style={{ flex: 1 }}>
        <Routes>
        <Route exact path="/signup" element={!user? <Signup /> : <Navigate to="/"/>} />
        <Route exact path="/login" element={!user ? <Login /> : <Navigate to="/"/>} />
        <Route exact path="/" element={user ? <Home />  : <Navigate to='/login'/>} />
        <Route exact path="/profile" element={user ? <Profile />  : <Navigate to='/login'/>} />
        <Route exact path="/Linked_dev" element={user ? <Linked_dev />  : <Navigate to='/login'/>} />
        <Route exact path="/status" element={user ? <Status />  : <Navigate to='/login'/>} />
        <Route exact path="/visualization" element={user ? <Visualization />  : <Navigate to='/login'/>} />

        <Route path='*' element={user? <NotFound /> : <NotFound/>}/>

      </Routes>
      </div>
      </div>
    </BrowserRouter>
  );
}
