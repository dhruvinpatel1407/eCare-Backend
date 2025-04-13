const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

require("dotenv").config();
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "eCare App API",
      description:
        "API documentation for a user management and appointment booking system",
      version: "1.0.0",
      contact: {
        name: "API Support",
        email: "contact@eCareapp.com",
      },
    },
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Physician ID"
            },
            firebaseUid: {
              type: "string",
              description: "Firebase User ID",
              unique: true,
              required: true
            },
            userName: {
              type: "string",
              description: "Username chosen by the user",
              required: true
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
              required: true
            },
            mobileNumber: {
              type: "string",
              format: "phone",
              description: "User's 10-digit Indian mobile number (optional)",
              required: false
            },
            passWord: {
              type: "string",
              description: "User password",
              required: true
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "When user was created"
            },
            demographics: {
              type: "string",
              format: "objectId",
              description: "Reference to user's demographic information"
            }
          },
          required: ["firebaseUid", "userName", "email", "passWord"],
          type: "object"
        },
        Physician: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Physician ID"
            },
            name: {
              type: "string",
              description: "Physician's full name"
            },
            speciality: {
              type: "string",
              description: "Physician's medical specialty"
            },
            clinics: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  clinicName: {
                    type: "string",
                    description: "Name of the clinic"
                  },
                  address: {
                    type: "string",
                    description: "Clinic address"
                  },
                  city: {
                    type: "string",
                    description: "City where the clinic is located"
                  },
                  workingDays: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        day: {
                          type: "string",
                          enum: [
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday"
                          ],
                          description: "Day of the week"
                        },
                        startTime: {
                          type: "string",
                          format: "date-time",
                          description: "Start time of working hours"
                        },
                        endTime: {
                          type: "string",
                          format: "date-time",
                          description: "End time of working hours"
                        }
                      },
                      required: ["day", "startTime", "endTime"]
                    }
                  }
                },
                required: ["clinicName", "address", "city", "workingDays"]
              },
              description: "List of clinics where physician is available with their working days"
            },
            contactNumber: {
              type: "string",
              description: "Physician's contact number"
            },
            email: {
              type: "string",
              description: "Physician's email address"
            }
          },
          required: ["name", "speciality", "clinics", "contactNumber", "email"],
          type: "object"
        },
        Appointment: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Appointment ID"
            },
            user: {
              type: "string",
              description: "User ID who booked the appointment"
            },
            physician: {
              type: "string",
              description: "Physician ID"
            },
            bookedTime: {
              type: "string",
              format: "date-time",
              description: "Time slot when appointment is booked"
            },
            status: {
              type: "string",
              enum: ["booked", "completed", "cancelled"],
              description: "Status of the appointment"
            }
          },
          required: ["user", "physician", "clinic", "bookedTime"],
          type: "object"
        },
        Service: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Appointment ID"
            },
            name: {
              type: "string",
              description: "Name of the service",
              required: true
            },
            description: {
              type: "string",
              description: "Detailed description of the service"
            },
            price: {
              type: "number",
              description: "Price of the service",
              required: true
            },
            category: {
              type: "string",
              enum: ["General", "Specialist", "Diagnostic", "Therapeutic"],
              description: "Category of the service"
            }
          },
          required: ["name", "description", "price"],
          type: "object"
        },
        Demographic: {
          type: "object",
          properties: {
            userId: {
              type: "string",
              description: "User ID (ObjectId)",
              format: "objectId"
            },
            dateOfBirth: {
              type: "string",
              format: "date-time",
              description: "Date of Birth in dd/mm/yyyy format"
            },
            gender: {
              type: "string",
              enum: ["Male", "Female", "Other", "Prefer not to say"],
              description: "Gender of the user"
            },
            bloodGroup: {
              type: "string",
              enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
              description: "Blood group of the user"
            },
            height: {
              type: "number",
              description: "Height of the user in cm"
            },
            weight: {
              type: "number",
              description: "Weight of the user in kg"
            },
            address: {
              type: "object",
              properties: {
                street: {
                  type: "string",
                  description: "Street address"
                },
                city: {
                  type: "string",
                  description: "City name"
                },
                state: {
                  type: "string",
                  description: "State name"
                },
                zipCode: {
                  type: "string",
                  pattern: "^[0-9]{6}$",
                  description: "6-digit zip code"
                }
              },
              required: ["street", "city", "state", "zipCode"]
            },
            maritalStatus: {
              type: "string",
              enum: ["Single", "Married", "Divorced", "Widowed"],
              description: "Marital status of the user"
            },
            occupation: {
              type: "string",
              description: "Occupation of the user"
            },
            profilePicture : {
              type: "string",
              format: "binary",
              description: "Base64 encoded profile picture (max size: 1MB)",
            },
            profilePictureType: {
              type: "string",
              enum: ["JPG", "JPEG"],
              description: "Type of the profile picture",
            },
          },
          required: ["userId", "dateOfBirth", "gender", "bloodGroup", "height", "weight", "address", "maritalStatus", "occupation"],
          type: "object"
        },
        ReportModel: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Physician ID"
            },
            filename: {
              type: "string",
              description: "Name of the report file",
              required: true
            },
            contentType: {
              type: "string",
              description: "MIME type of the report file",
              required: true
            },
            data: {
              type: "string",
              format: "binary",
              description: "Report file data in base64 format",
              required: true
            },
            userId: {
              type: "string",
              format: "objectId",
              description: "Reference to the user who owns this report",
              required: true
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "When the report was created"
            }
          },
          required: ["filename", "contentType", "data", "userId"],
          type: "object"
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
    servers: [
      {
        url: process.env.BACKEND_URL,
        description: "Production server",
      },
      {
        url: "http://localhost:8080",
        description: "Local Server",
      },
    ],
  },
  apis: [
    path.join(__dirname, "routes/**/*.js"),
    path.join(__dirname, "controllers/**/*.js"),
  ], // Ensure this path is correct
};

const specs = swaggerJSDoc(swaggerOptions);

module.exports = specs;
