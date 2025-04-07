const mongoose = require("mongoose");

const physicianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  speciality: { 
    type: String, 
    required: true 
  },
  clinics: [
    {
      clinicName: { 
        type: String, 
        required: true 
      },
      address: { 
        type: String, 
        required: true 
      },
      city: { 
        type: String, 
        required: true 
      },
      workingDays: [
        {
          day: {
            type: String,
            enum: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
          },
          startTime: { 
            type: Date, 
            required: true 
          },
          endTime: { 
            type: Date, 
            required: true 
          },
        },
      ],
    },
  ],
  contactNumber: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
});

const PhysicianCollection = mongoose.model("PhysicianCollection", physicianSchema);

module.exports = PhysicianCollection;