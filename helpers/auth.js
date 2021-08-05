import axios from 'axios';
import { genSalt, hash } from 'bcryptjs';

export async function saltAndHash(plainTextPassword) {
  const salt = await genSalt(10);
  const encryptedPassword = await hash(plainTextPassword, salt);
  return encryptedPassword;
}

export async function createUser(email, password) {
  const reqBody = {
    email: email,
    password: password,
  };

  const reqHeaders = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let data;

  try {
    const res = await axios.post('/api/auth/register', reqBody, reqHeaders);
    data = res.data;
  } catch (err) {
    throw new Error(err.message || 'User creation error.');
  }

  return data;
}
