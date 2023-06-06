const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  devices: [
    {
      id: Number,
      name: String,
      statusIcon: String,
      dataIcon: String,
      // timer: Number,
      // stopDevice: Boolean,
      gpsData: [
        {
          latitude: Number,
          longitude: Number,
          elapsedTime: String 
        }
      ]
    },
  ],
});


// /////////////////////////FAKE DATA //////////////////////

function generateRandomCoordinatesWithElapsedTime() {
  const latitude = Math.random() * 5;
  const longitude = Math.random() * 5; 
  const elapsedTime = generateFakeElapsedTime();
  return { latitude, longitude, elapsedTime };
}

function generateFakeElapsedTime() {
  const seconds = Math.floor(Math.random() * 60);
  const minutes = Math.floor(Math.random() * 60);
  const hours = Math.floor(Math.random() * 24);

  // Format the elapsed time as HH:MM:SS
  // .padStart(2,'0') : if i have 3 it will be '03' ( for nums <= 9 )
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return formattedTime;
}

userSchema.pre('save', function(next) {
  const user = this;
  if (user.isModified('devices')) {
    const randomIndexes = getRandomIndexes(user.devices.length, 2); 
    user.devices.forEach((device, index) => {
      if (randomIndexes.includes(index)) {
        device.statusIcon = 'SignalWifiStatusbarNullIcon';
        device.dataIcon = 'SignalWifiStatusbarNullIcon';
        // Empty gpsData for the selected devices.
        return;
      }

      device.gpsData = [];
      
      for (let i = 0; i < 5; i++) {
        const { latitude, longitude, elapsedTime } = generateRandomCoordinatesWithElapsedTime();
        device.gpsData.push({ latitude, longitude, elapsedTime });
      }
    });
  }
   
  next();
});

// Helper function to generate random indexes
function getRandomIndexes(length, count) {
  const indexes = [];
  while (indexes.length < count) {
    const randomIndex = Math.floor(Math.random() * length);
    if (!indexes.includes(randomIndex)) {
      indexes.push(randomIndex);
    }
  }
  return indexes;
}
/////////////////////////////////////////////////////////////////////////////////////////



// static signup method 
userSchema.statics.signup = async function(email, password) {
  if (!email || !password) {
    throw new Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw new Error('Email is not valid.');
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw new Error('Email already in use.');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const devices = [
    {
      id: 1,
      name: 'device 1',
      statusIcon: 'SignalWifiStatusbar4BarIcon',
      dataIcon: 'SignalWifiStatusbar4BarIcon',
      // timer: Math.floor(Math.random() * 30),
      // stopDevice: false,
    },
    {
      id: 2,
      name: 'device 2',
      statusIcon: 'SignalWifiStatusbar4BarIcon',
      dataIcon: 'SignalWifiStatusbar4BarIcon',
      // timer: Math.floor(Math.random() * 30),
      // stopDevice: false,
    },
    {
      id: 3,
      name: 'device 3',
      statusIcon: 'SignalWifiStatusbar4BarIcon',
      dataIcon: 'SignalWifiStatusbar4BarIcon',
      // timer: Math.floor(Math.random() * 30),
      // stopDevice: false,
    },
    {
      id: 4,
      name: 'device 4',
      statusIcon: 'SignalWifiStatusbar4BarIcon',
      dataIcon: 'SignalWifiStatusbar4BarIcon',
      // timer: Math.floor(Math.random() * 30),
      // stopDevice: false,
    },
  ];

  const user = await this.create({
    email,
    password: hash,
    devices,
  });

  return user;
};

// static login method 
userSchema.statics.login = async function(email,password){
  if (!email || !password){
    throw Error('All fields must be filled')
  }
  const user = await this.findOne({email});
  if (!user) {
    throw Error('Incorrect email.')
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}

module.exports = mongoose.model('User', userSchema);



