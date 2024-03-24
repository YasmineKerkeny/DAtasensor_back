const express = require('express');
const axios = require('axios'); 
const RealTimeSensors = require ('../models/realTimeSensors');
const Channel = require('../models/realTimeSensors');


// (Optional) Replace with your actual external API URL
const externalDataURL = 'https://sensecap.seeed.cc/openapi/view_latest_telemetry_data?device_eui=2CF7F16952300062';

const app = express.Router();

// Username and password for authentication
const username = 'A1X3PI03IGXA737E';
const password = '1E45F79205044C46983BA582578BCA8D3F5707258DD04BD3AF843F903B2F6DA6';


app.get('/SensorData', async (req, res) => {
  try {
    // Configure basic authentication headers
    const auth = {
      username,
      password,
    };

    const config = {
      method: 'get',
      url: externalDataURL,
      auth, 
    };

    // Fetch data from the external URL using axios
    const response = await axios(config);

    // Check if data is fetched successfully
    if (response.status !== 200) {
      return res.status(response.status).json({ error: 'Failed to fetch data' });
    }

   
    const sensorData = response.data.data;
      const myData=JSON.stringify(sensorData,null,2);
    console.log(`${myData}\n`);
      
    for (const channelData of sensorData) {
      
      const channelIndex = channelData.channel_index;
      console.log(`channelindex:${channelIndex}`);
      const pointts = channelData.points.map((point,index) => {
           console.log(`@${index}`);
          let sensorType = 'default';
          console.log(`sensortype:${sensorType}`);
          console.log(`point.time:${point.time}`);
          console.log(`point.measurement_value:${point.measurement_value}`);
      
        // Mapping measurement IDs to appropriate fields
       const measurementId = point.measurement_id;
       console.log(`measurementId:${measurementId}`);
         if (measurementId === '4124') {
          console.log("we are in the temp loop");
          sensorType = 'temperature';
        } else if (measurementId === '4109') {
          console.log("we are in the do loop");
          sensorType = 'dissolved_oxygen';
        }else {
          console.log("Oops");
        }
        console.log("\n");
        return {
          measurement_value: point.measurement_value,
          time: point.time,
          sensor_type: sensorType
        };
      });
      // Create a new channel documen
      const channel = new Channel({
        channel_index: channelIndex,
        points: pointts,
      });
      console.log(channel);

      // Save the channel to the database
      await channel.save();
     }

    //res.status(200).json({ message: 'Data saved successfully' });
    console.log('Data saved successfully' );
    res.status(200).json(sensorData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = app;
