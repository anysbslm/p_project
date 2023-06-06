import React from 'react';
import GPSChart from './GPSChart';
import Modal from './Modal';

const GPSChartModal = ({ onClose, gpsData }) => {
  return (
    <Modal name="GPS Chart" onClose={onClose}>
      <GPSChart gpsData={gpsData} />
    </Modal>
  );
};

export default GPSChartModal;