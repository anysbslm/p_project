import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4';
import SignalWifiStatusbarNullIcon from '@mui/icons-material/SignalWifiStatusbarNull';
import CloseIcon from '@mui/icons-material/Close';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CircularJSON from 'circular-json';
import { useAuthContext } from '../hooks/useAuthContext';

const Status = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState([]);
  const {user} = useAuthContext();

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
    if (user){
      fetchDevices();
    }
    
  }, [setModalData,user]);

  useEffect(() => {
    // why circularJSON? Circular JSON serializes and deserializes otherwise valid JSON objects
    // containing circular references into and from a specialized JSON format.
    localStorage.setItem('modalData', CircularJSON.stringify(modalData));
  }, [modalData]);

  const handleOpenModal = (id) => {
    setActiveModal(id);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  // const handleStopDevice = (modalId) => {
  //   setModalData((prevData) =>
  //     prevData.map((modal) => {
  //       if (modal.id === modalId) {
  //         return {
  //           ...modal,
  //           stopDevice: true,
  //         };
  //       }
  //       return modal;
  //     })
  //   );
  // };

  // const handleRestartDevice = (modalId) => {
  //   setModalData((prevData) =>
  //     prevData.map((modal) => {
  //       if (modal.id === modalId) {
  //         return {
  //           ...modal,
  //           statusIcon: 'SignalWifiStatusbarConnectedNoInternet4Icon',
  //           dataIcon: 'SignalWifiStatusbarConnectedNoInternet4Icon',
  //           stopDevice: false,
  //           timer: 0,
  //           isIconChanged: true,
  //         };
  //       }
  //       return modal;
  //     })
  //   );

  //   setTimeout(() => {
  //     setModalData((prevData) =>
  //       prevData.map((modal) => {
  //         if (modal.id === modalId) {
  //           return {
  //             ...modal,
  //             statusIcon: 'SignalWifiStatusbar4BarIcon',
  //             dataIcon: 'SignalWifiStatusbar4BarIcon',
  //             isIconChanged: false,
  //           };
  //         }
  //         return modal;
  //       })
  //     );
  //   }, 3000);
  // };

  // const formatTime = (seconds) => {
  //   const minutes = Math.floor(seconds / 60);
  //   const remainingSeconds = seconds % 60;
  //   return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  // };

    // retrieve the corresponding MUI icon component dynamically.
  //  The React.createElement() method is used to create the icon component based on the icon name stored in modalData.

  const iconMappings = {
    SignalWifiStatusbar4BarIcon: SignalWifiStatusbar4BarIcon,
    SignalWifiStatusbarConnectedNoInternet4Icon: SignalWifiStatusbarConnectedNoInternet4Icon,
    SignalWifiStatusbarNullIcon: SignalWifiStatusbarNullIcon,
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
              <p>status: {modal.stopDevice ? <SignalWifiStatusbarNullIcon /> : modal.isIconChanged ? <SignalWifiStatusbarConnectedNoInternet4Icon /> : (iconMappings[modal.statusIcon] && React.createElement(iconMappings[modal.statusIcon]))}</p>
              <p>data: {modal.stopDevice ? <SignalWifiStatusbarNullIcon /> : modal.isIconChanged ? <SignalWifiStatusbarConnectedNoInternet4Icon /> :  (iconMappings[modal.dataIcon] && React.createElement(iconMappings[modal.dataIcon]))}</p>
              {/* <p>Time: {formatTime(modal.timer++)}</p> */}
              {/* <button style={{ marginLeft: 80 }} onClick={() => handleRestartDevice(modal.id)}> */}
                {/* <AutorenewIcon />
                Restart Device
              {/* </button> */}
              {/* <button onClick={() => handleStopDevice(modal.id)}> */}
                {/* <CloseIcon />
                Stop Device  */}
              {/* </button> */}
            </Modal>
          ))
        ) : (
          <p className='text'>NO DATA</p>
        )}
      </div>
    );
  };
  
  export default Status;



