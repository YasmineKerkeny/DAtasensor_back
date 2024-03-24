const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema({
  measurement_value: {
    type: Number,
    required: true,
  },
  sensor_type: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
});

const ChannelSchema = new mongoose.Schema({
  channel_index: {
    type: Number,
    required: true,
  },
  points: [MeasurementSchema],
});

const Channel = mongoose.model('SensorData', ChannelSchema);

module.exports = Channel;
