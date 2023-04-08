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
        if (!result) return reject(err);
        if (token === result) return resolve(userId);
        reject({ message: "Unauthorized request, Please Login again." });
      });
      client.quit();
    });
  });
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
