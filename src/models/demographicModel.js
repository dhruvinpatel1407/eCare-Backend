const mongoose = require("mongoose");
const validators = require("../utils/utils");

const demographicsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCollection",
    required: [true, "User ID is required"],
    index: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of Birth is required"],
    validate: {
      validator: function(date) {
        const dateString = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        return validators.dateValidator(dateString);
      },
      message: "Please enter a valid date in dd/mm/yyyy format"
    }
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", "Prefer not to say"],
    required: [true, "Gender is required"]
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: [true, "Blood Group is required"]
  },
  height: {
    type: Number,
    required: [true, "Height is required"]
  },
  weight: {
    type: Number,
    required: [true, "Weight is required"]
  },
  address: {
    street: {
      type: String,
      required: [true, "Street Address is required"]
    },
    city: {
      type: String,
      required: [true, "City is required"]
    },
    state: {
      type: String,
      required: [true, "State is required"]
    },
    zipCode: {
      type: String,
      validate: {
        validator: function(v) {
          return validators.zipCodeValidator(v);
        },
        message: "Please enter a valid 6-digit zip code"
      },
      required: [true, "Zip Code is required"]
    }
  },
  maritalStatus: {
    type: String,
    enum: ["Single", "Married", "Divorced", "Widowed"],
    required: [true, "Marital Status is required"]
  },
  occupation: {
    type: String,
    required: [true, "Occupation is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  profilePicture: {
    type: Buffer,
    validate: {
      validator: function(v) {
        const buffer = Buffer.from(v, 'base64');
       
        return validators.imageSizeValidator(buffer, 5); // 1MB size limit
      },
      message: "Profile picture must be less than 1MB"
    },
    optional: true
  },
  profilePictureType: {
    type: String,
    validate: {
      validator: function(v) {
        return validators.imageTypeValidator(v);
      },
      message: "Invalid image type. Only PNG, JPG, JPEG, and GIF are allowed."
    },
    optional: true
  }
});

// Virtual field for formatted date of birth
demographicsSchema.virtual('formattedDateOfBirth').get(function() {
  const date = this.dateOfBirth;
  if (date) {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }
  return null;
});

// Virtual field for user details (will be populated from User collection)
demographicsSchema.virtual('userDetails').get(function() {
  return {
    userId: this.userId
  };
});

// Index for better query performance
// demographicsSchema.index({ userId: 1 });

const DemographicsCollection = mongoose.model("DemographicsCollection", demographicsSchema);

module.exports = DemographicsCollection;