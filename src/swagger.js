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
            id: {
              type: "string",
              description: "User ID",
            },
            userName: {
              type: "string",
              description: "Username chosen by the user",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            mobileNumber: {
              type: "string",
              format: "phone",
              description: "User's 10-digit Indian mobile number (optional)",
            },
          },
          required: ["userName", "email"],
          type: "object",
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
            specialty: {
              type: "string",
              description: "Physician's medical specialty"
            },
            contactNumber: {
              type: "string",
              description: "Physician's contact number"
            },
            clinics: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: {
                    type: "string",
                    description: "Clinic ID"
                  },
                  clinicName: {
                    type: "string",
                    description: "Name of the clinic"
                  },
                  address: {
                    type: "string",
                    description: "Clinic address"
                  }
                }
              },
              description: "List of clinics where physician is available"
            }
          },
          required: ["name", "specialty", "contactNumber", "clinics"],
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
            clinic: {
              type: "string",
              description: "Clinic ID where appointment is booked"
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
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "When appointment was created"
            }
          },
          required: ["user", "physician", "clinic", "bookedTime"],
          type: "object"
        },
        Service: {
          type: "object",
          properties: {
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
        Demographics: {
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
            formattedDateOfBirth: {
              type: "string",
              format: "date-time",
              description: "Formatted date of birth in dd/mm/yyyy"
            },
            userDetails: {
              type: "object",
              properties: {
                userId: {
                  type: "string",
                  description: "User ID"
                }
              }
            }
          },
          required: ["userId", "dateOfBirth", "gender", "bloodGroup", "height", "weight", "address", "maritalStatus", "occupation"],
          type: "object"
        }
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
