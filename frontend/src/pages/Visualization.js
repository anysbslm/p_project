import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import GPSChart from '../components/GPSChart';
import BreakDown from '../components/BreakDown';
import HeatmapChart from '../components/HeatmapChart';
import DistanceChart from '../components/DistanceChart';
import DistanceVisualization from '../components/DistanceVisualization';

const Visualization = () => {
  const [devices, setDevices] = useState(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
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
          const devicesWithGPSData = response.data.filter(device => device.gpsData.length > 0);
          setDevices(devicesWithGPSData);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    if (user) {
      fetchDevices();
    }
  }, [setDevices, user]);

  const handleDeviceChange = (event) => {
    const deviceId = event.target.value;
    setSelectedDeviceId(deviceId);
  };

  const allGPSData = devices ? devices.flatMap(device => device.gpsData) : [];

  return (
    <>
      <div className="form-center" style={{ caretColor: 'transparent', marginLeft: 30, marginTop: 1 }}>
        <div>
          {devices && (
            <select className='dropdown' style={{ marginTop: 15, marginBottom: 15 }} onChange={handleDeviceChange}>
              <option>Select a device</option>
              {devices.map((device) => (
                <option key={device._id} value={device._id}>
                  {device.name}
                </option>
              ))}
            </select>
          )}
        </div>
        {selectedDeviceId && (
          <div>
            {devices &&
              devices.map((device) => {
                if (device._id === selectedDeviceId) {
                  return (
                    <div key={device._id}>
                      <div className='charts-container' style={{ display: 'flex', marginTop: '3%', gap: '15px', marginRight:'27%'}}>
                        <div className='chart-container'>
                          <div className='Trajet' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                            <div className='text'></div>
                            <div style={{marginRight:'-3%'}}>
                            <div className="visualization-wrapper">
                            <GPSChart gpsData={device.gpsData} />
                            </div>
                            </div>
                            <div className="visualization-wrapper">
                            <BreakDown gpsData={device.gpsData} />
                            </div>
                            </div>
                          <div style={{marginTop:'-14%', marginRight:'60%'}}>
                          <DistanceChart gpsData={device.gpsData} />

                          </div>
                          <div style={{marginLeft:'97%', marginTop:'-25%'}}>
                          <div className="visualization-wrapper">
                          <DistanceVisualization gpsData={device.gpsData} />
                          </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
          </div>
        )}
      </div>
      <div className='heatmap-container' style={{ position: 'fixed', top: 50, right: -230, marginTop: '3%', marginRight: '3%', zIndex: 100 }}>
        <div className="heatmap-chart">
        <div className='text'></div>

          <HeatmapChart gpsData={allGPSData} />
        </div>
      </div>
    </>
  );
};

export default Visualization;
