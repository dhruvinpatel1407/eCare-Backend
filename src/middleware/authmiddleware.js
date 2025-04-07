const { verifyToken } = require("../config/auth");
const chalk = require("chalk");
const { auth } = require('../config/firebaseAdmin');

// const authenticate = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;

//     if (!token) {
//       return res
//         .status(401)
//         .json({ error: "Access denied. No token provided." });
//     }

//     const decoded = verifyToken(token);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.error(chalk.red.bold("Token verification error: "), err);
//     res.status(401).json({ error: "Invalid token" });
//   }
// };

// async function verifyFirebaseToken(req, res, next) {
//   if (!req.headers.authorization) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     const decodedToken = await auth.verifyIdToken(token);
    
//     req.user = decodedToken;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// }


// module.exports = {authenticate, verifyFirebaseToken};


const eitherAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  // First try Firebase token
  try {
    const firebaseUser = await auth.verifyIdToken(token);
    req.user = firebaseUser;
    req.authType = "firebase";
    return next();
  } catch (firebaseError) {
    // Firebase token failed, try JWT
    try {
      const jwtUser = verifyToken(token); // your custom verifyToken function
      req.user = jwtUser;
      req.authType = "jwt";
      return next();
    } catch (jwtError) {
      console.error(chalk.red("Auth failed: "), jwtError.message);
      return res.status(401).json({ message: "Invalid token" });
    }
  }
};

module.exports = eitherAuth;