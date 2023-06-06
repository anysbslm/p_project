import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { useUpdate } from '../hooks/useUpdate';

const Profile = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { updatePassword, isLoading, error } = useUpdate();
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  const handleLogout = () => {
    logout();
  };

  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setUpdateError('Passwords do not match');
      return;
    }

    try {
      const result = await updatePassword(user.email, currentPassword, newPassword);
      console.log(result);
      setUpdateError(null);
      setUpdateSuccess('Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.log(error);
      setUpdateError('Error updating profile. Please try again.');
    }
  };

  return (
    <>
      <div className="form-center" style={{ caretColor: 'transparent' }}>
        <div className="homep">
        Change your password:
          <form onSubmit={handleSubmit}>
            <div className="field">
              <div className="fas fa-lock"></div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <div className="fas fa-lock"></div>
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="field">
              <div className="fas fa-lock"></div>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="field">
              <div className="fas fa-lock"></div>
              <input
                type="password"
                name="newPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button disabled={isLoading}>Save</button>
          </form>
          {updateError && <p className="homep" style={{color: 'red'}}>{updateError}</p>}
          {updateSuccess && <p className="homep">{updateSuccess}</p>}
          <div className="logout_button">
            <Button onClick={handleLogout} color="inherit">
              Quit Session
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;