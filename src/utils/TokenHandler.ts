const jwt = require("jsonwebtoken");

const accessToken = (user) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return accessToken;
};

const refreshToken = (user) => {
  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );
  return refreshToken;
};

const VerifyAccessToken = (token) => {
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      let error = new Error();
      error.status = 401;
      error.message = "Invalid Access Token";
      error.cause = "accessToken";
      throw error;
    }
    console.log(decoded);
    return decoded;
  });
};

const VerifyRefreshToken = (token) => {
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

module.exports = {
  accessToken,
  refreshToken,
  VerifyAccessToken,
  VerifyRefreshToken,
};
