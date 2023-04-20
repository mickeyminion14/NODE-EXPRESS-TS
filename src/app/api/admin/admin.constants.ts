export const ADMIN_MESSAGES = {
  LOGIN: {
    SUCCESS: 'You are logged in successfully.',
    INVALID: 'Incorrect email or password, please ensure credentials were entered correctly.',
    NOT_FOUND: 'Admin does not exist.'
  },
  PROFILE: {
    SUCCESS: 'Successfull',
    UPDATED: 'Profile updated successfully.'
  },
  FORGOT_PASSWORD: {
    SUCCESS: 'Success',
    NOT_FOUND: 'Admin does not found.'
  },
  RESET_PASSWORD: {
    Success: 'Success.',
    NOT_FOUND: 'Admin does not found.',
    INVALID_TOKEN: 'Invalid token!',
    TOKEN_EXPIRED: 'Token expired!'
  },
  UPDATE: {
    NOT_FOUND: 'Admin does not found.'
  }
};

export enum TokenStatus {
  Active,
  Expired,
  Invalid
}
