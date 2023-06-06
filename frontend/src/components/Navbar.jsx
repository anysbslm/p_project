import React from 'react';
import { Button, Avatar } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
  const { user } = useAuthContext();

  return (
    <div className='header' style={{ caretColor: 'transparent' }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "right" }} className='toolbar'>
          {!user && (
            <div>
              <a href="/Signup"><Button color="inherit">Sign Up</Button></a>
              <a href="/Login"><Button color="inherit">Login</Button></a>
            </div>
          )}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>{user.email}</span>
              <Avatar sx={{ bgcolor: '#3498db', mr: 1, mt:0, ml:1 }}>{user.email.charAt(0)}</Avatar>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
