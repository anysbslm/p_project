import React, { useState } from 'react';
import './Modal.css';
import { Button } from '@mui/material';

export default function Modal({ children, name }) {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <>
      <div className="form-center" style={{ caretColor: 'transparent'}}>
        <div className="text">
          <div className="status_modal">
            <Button color="inherit" onClick={toggleModal} className="btn-modal">
              {name}
            </Button>
            {modal && (
              <div className="modal">
                <div className="overlay">
                  <div className="modal-content">
                    <h2>{name}</h2>
                    {children}
                    <Button color="inherit" className="close-modal" style={{marginTop: 5}} onClick={toggleModal}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}