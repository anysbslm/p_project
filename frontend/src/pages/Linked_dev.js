import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import CircularJSON from 'circular-json';
import { useAuthContext } from '../hooks/useAuthContext';
import { Button } from '@mui/material';

const Linked_dev = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [linkError, setLinkError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [linkSuccess, setLinkSuccess] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/devices', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (response.status === 200) {
          setModalData(response.data);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    if (user) {
      fetchDevices();
    }
  }, [setModalData, user]);

  const handleOpenModal = (id) => {
    setActiveModal(id);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleLinkDevice = async (deviceId, receiverEmail) => {
    try {
      const response = await axios.put(
        'http://localhost:4000/api/devices',
        {
          email: receiverEmail,
          deviceId: deviceId,
        },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 200) {
        setLinkSuccess('Device linked successfully.'); 
        setLinkError(null); 
      }
    } catch (error) {
      console.error('Error linking device:', error);
      setLinkError('Error linking device. Please try again.'); 
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    try {
      const response = await axios.delete(
        'http://localhost:4000/api/devices',
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
          data: {
            deviceId: deviceId,
          },
        }
      );

      if (response.status === 200) {
        setDeleteSuccess('Device deleted successfully.'); 
        setDeleteError(null); 
      }
    } catch (error) {
      console.error('Error deleting device:', error);
      setDeleteError('Error deleting device. Please try again.'); 
    }
  };

  return (
    <div className="status-container">
      {modalData.length > 0 ? (
        modalData.map((modal) => (
          <Modal
            key={modal._id}
            name={modal.name}
            id={modal.id}
            isActive={activeModal === modal._id}
            onOpen={handleOpenModal}
            onClose={handleCloseModal}
          >
            <br />
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleLinkDevice(modal._id, event.target.email.value);}} >
                  <div className="field">
                    <input value={modal._id} readOnly />      
                  </div>
                  <br />
                  <p>User Email</p>
                  <div className="field">
                    <input name="email" placeholder={user.email} />
                  </div>
                  <Button type="submit" color="inherit" className="close-modal" style={{ marginTop: 60 }}>
                    Link
                  </Button>
                  <Button
                    onClick={() => handleDeleteDevice(modal._id)}
                    color="inherit"
                    className="close-modal"
                    style={{ marginTop: 60 }}
                  >
                    DELETE
                  </Button>
                </form>
                {linkError && <p className="error">{linkError}</p>}
                {linkSuccess && <p className="success">{linkSuccess}</p>}
                {deleteError && <p className="error">{deleteError}</p>}
                {deleteSuccess && <p className="success">{deleteSuccess}</p>}
              </Modal>
            ))
          ) : (
            <p className='text'>NO DATA</p>
          )}
        </div>
        );
};

export default Linked_dev;