import jwt from "jsonwebtoken";
const { sign, verify } = jwt;

const accessTokenValue = process?.env?.["ACCESS_TOKEN_SECRET"] || "";
const refreshTokenValue = process?.env?.["REFRESH_TOKEN_SECRET"] || "";

const accessToken = (user: any) => {
  const accessToken = sign(
    {
      id: user._id,
    },
    accessTokenValue,
    {
      expiresIn: "7d",
    }
  );
  return accessToken;
};

const refreshToken = (user: any) => {
  const refreshToken = sign(
    {
      id: user._id,
    },
    refreshTokenValue,
    {
      expiresIn: "30d",
    }
  );
  return refreshToken;
};

const VerifyAccessToken = (token: string) => {
  verify(token, accessTokenValue, (err: unknown, decoded: any) => {
    if (err) {
      let error = new Error();
      // error.status = 401;
      error.message = "Invalid Access Token";
      error.cause = "accessToken";
      throw error;
    }
    console.log(decoded);
    return decoded;
  });
};

const VerifyRefreshToken = (token: string) => {
  verify(token, refreshTokenValue, (err: unknown, decoded: any) => {
    if (err) {
      let error = new Error();
      // error.status = 401;
      error.message = "Invalid Refresh Token";
      error.cause = "refreshToken";
      throw error;
    }
    console.log(decoded);
    return decoded;
  });
};

export { accessToken, refreshToken, VerifyAccessToken, VerifyRefreshToken };
