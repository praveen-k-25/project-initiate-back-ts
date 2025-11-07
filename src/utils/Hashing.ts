const argon = require("argon2");

const hashPassword = async (password) => {
  try {
    const hash = await argon.hash(password);
    return hash;
  } catch (error) {
    let err = new Error();
    err.status = 500;
    err.message = "Hashing Error";
    throw err;
  }
};

const VerifyPassword = async (hash, password) => {
  try {
    return await argon.verify(hash, password);
  } catch (error) {
    let err = new Error();
    err.status = 500;
    err.message = "Veriy Password Error";
    throw err;
  }
};

module.exports = {hashPassword, VerifyPassword};
