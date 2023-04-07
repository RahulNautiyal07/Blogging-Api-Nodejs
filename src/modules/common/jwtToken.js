const config = require("config");
const jwt = require("jsonwebtoken");
const { accessToken, refreshToken } = config.get("jwt");
const client = require("../../db/redis_init");

const generateAccessToken = (payload, expiryTime = accessToken.time) => {
  return new Promise((resolve, reject) => {
    const secret = accessToken.secretKey;
    const options = { expiresIn: expiryTime, issuer: "www.api.com" };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(err);
        return;
      }
      resolve(token);
    });
  });
};

const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, accessToken.secretKey, (err, payload) => {
      if (err) return reject(err);
      const userId = payload.userId;
      if (userId) return resolve(payload);
      reject({ message: "Unauthorized Request" });
    });
  });
};

const generateRefreshToken = (payload, expiryTime = refreshToken.time) => {
  return new Promise((resolve, reject) => {
    const secret = refreshToken.secretKey;
    const userId = payload.userId.toString();
    console.log(userId);
    const options = { expiresIn: expiryTime, issuer: "www.api.com" };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) return reject(err);
      client.connect();
      client.set(userId, token, { EX: 365 * 24 * 60 * 30 }).then((result) => {
        if (!result) reject({ message: "Token Not Found" });
        return resolve(token);
      });
      client.quit();
    });
  });
};

const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, refreshToken.secretKey, (err, payload) => {
      if (err) return reject(err);
      const userId = payload.userId;
      client.connect();
      client.get(userId).then((result) => {
        console.log(result, "resuklr");
        if (!result) return reject(err);
        if (token === result) return resolve(userId);
        reject({ message: "Unauthorized request, Please Login again." });
      });
      client.quit();
    });
  });
};

// const signRefreshhToken = (userId) => {
//   return new Promise((resolve, reject) => {
//     const payload = {}
//     const secret = process.env.REFRESH_TOKEN_SECRET
//     const options = {
//       expiresIn: '1y',
//       issuer: 'pickurpage.com',
//       audience: userId,
//     }
//     JWT.sign(payload, secret, options, (err, token) => {
//       if (err) {
//         console.log(err.message)
//         // reject(err)
//         reject(createError.InternalServerError())
//       }

//       client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
//         if (err) {
//           console.log(err.message)
//           reject(createError.InternalServerError())
//           return
//         }
//         resolve(token)
//       })
//     })
//   })
// }
// const verifyRefreshhToken = (refreshToken) => {
//   return new Promise((resolve, reject) => {
//     JWT.verify(
//       refreshToken,
//       process.env.REFRESH_TOKEN_SECRET,
//       (err, payload) => {
//         if (err) return reject(createError.Unauthorized())
//         const userId = payload.aud
//         client.GET(userId, (err, result) => {
//           if (err) {
//             console.log(err.message)
//             reject(createError.InternalServerError())
//             return
//           }
//           if (refreshToken === result) return resolve(userId)
//           reject(createError.Unauthorized())
//         })
//       }
//     )
//   })
// }
module.exports = {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
