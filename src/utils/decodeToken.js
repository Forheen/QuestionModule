import * as jwt_decode from 'jwt-decode';

export const DecodeToken = (token) => {
  try {
    return jwt_decode(token); // Returns decoded token
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};