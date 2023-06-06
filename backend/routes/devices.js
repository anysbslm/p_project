const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');


function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, `${process.env.JWT_SECRET}`, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

// Getting the devices .
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // get devices for each user
    const user = await User.findById(userId).select('devices');
    const devices = user.devices;
    // console.log(devices)
    res.json(devices);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Link device from user A to user B
router.put('/', authenticateToken, async (req, res) => {
  try {
    const senderId = req.user._id;
    const { email, deviceId } = req.body;

    // find sender by id
    let senderUser = await User.findById(senderId);
    if (!senderUser) {
      return res.status(404).json({ error: 'Sender user not found' });
    }
    console.log('Sender user:', senderUser);

    // Find the device to transfer from the sender's devices
    const deviceToSend = senderUser.devices.find((device) => device._id.toString() === deviceId);
    if (!deviceToSend) {
      return res.status(404).json({ error: 'Device not found in sender user' });
    }
    console.log('Device to send:', deviceToSend);

    // Check if the receiver user already has the device
    let receiverUser = await User.findOne({ email });
    if (!receiverUser) {
      return res.status(404).json({ error: 'Receiver user not found' });
    }
    console.log('Receiver user:', receiverUser);

    const deviceExists = receiverUser.devices.some((device) => device._id.toString() === deviceId);
    if (deviceExists) {
      return res.status(400).json({ error: 'Device already exists in receiver user' });
    }

    // adding id for each device's name
    deviceToSend.name = `linked device (${deviceId})`;

    // Push the device to the receiver user's devices
    receiverUser = await User.findOneAndUpdate(
      { email },
      { $push: { devices: deviceToSend } },
      { new: true }
    );
    console.log('Updated receiver:', receiverUser);

    res.json({ message: 'Device transferred successfully' });
  } catch (error) {
    console.log('Error:', error);
    res.status(400).json({ error: error.message });
  }
});


// deleting the device 
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const deviceId = req.body.deviceId; // value from input. from body.

    // Find the user by id
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('user:', user);

    // test if the device exists in user devices array. if true, device exists.
    const deviceExists = user.devices.some((device) => device._id.toString() === deviceId);
    // device._id.toString() : device._id : type in mongodb: ObjectId. toString() converts it to string.
    if (deviceExists) {
      user = await User.findByIdAndUpdate(
        userId,
        { $pull: { devices: { _id: deviceId } } }, // Use $pull operator to remove the device with the specified id
        { new: true }
      );
      console.log('Updated user:', user);
      return res.json({ message: 'Device deleted successfully' });
    } else {
      return res.status(404).json({ error: 'Device not found' });
    }
  } catch (error) {
    console.log('Error:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;