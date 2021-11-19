import { verify } from 'jsonwebtoken';
import { JWT_ALGORITHM, JWT_SECRET } from '../config/environment';

export const decodeJwtToken = (bearerToken = '') => {
  if (bearerToken.startsWith('Bearer ')) {
    try {
      return verify(bearerToken.slice(7), JWT_SECRET, { algorithms: [JWT_ALGORITHM] });
    } catch (error) {
      console.error('decodeJwtToken error', bearerToken, error);
    }
  }

  return null;
};
