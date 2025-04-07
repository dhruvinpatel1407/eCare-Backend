const mongoose = require("mongoose");
const { Schema } = mongoose;
const {formattedDateValidator} = require("../utils/utils");

const appointmentSchema = new mongoose.Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: "UserCollection" 
  },
  physician: { 
    type: Schema.Types.ObjectId, 
    ref: "PhysicianCollection" 
  },
  bookedTime: { 
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return formattedDateValidator(v);
      },
      message: 'Booked time must be in the format: dd/mm/yyyy hh:mm AM/PM'
    }
  },
  status: { 
    type: String, 
    enum: ["booked", "cancelled","rescheduled"] 
  },
});

const AppointmentCollection = mongoose.model("AppointmentCollecion", appointmentSchema);

module.exports = AppointmentCollection;