import { connectDB } from '../../../helpers/db';
import { emailRegex, passwordRegex } from '../../../helpers/regexs';
import { saltAndHash } from '../../../helpers/auth';

async function handler(req, res) {
  if (req.method !== 'POST') return;

  const { email, password } = req.body;

  if (
    !email ||
    !password ||
    !emailRegex.test(email) ||
    !passwordRegex.test(password)
  ) {
    res.status(422).json({
      message:
        'Invalid input - please check the email and password input requirements.',
    });
    return;
  }

  let client;

  try {
    client = await connectDB();
  } catch (err) {
    res.status(500).json({ message: 'Unable to connect to server.' });
  }

  const db = client.db();

  let existingUser;

  try {
    existingUser = await db.collection('users').findOne({ email: email });
  } catch (err) {
    client.close();
    res.status(500).json({ message: 'Unable to connect to server.' });
  }

  if (existingUser) {
    res.status(422).json({
      message: 'User already exists with that email, please try again.',
    });
    client.close();
    return;
  }

  let encryptedPassword;

  try {
    encryptedPassword = await saltAndHash(password);
  } catch (err) {
    client.close();
    res.status(500).json({ message: 'Security error.' });
  }

  let result;

  try {
    result = await db.collection('users').insertOne({
      email: email,
      password: encryptedPassword,
    });
  } catch (err) {
    client.close();
    res
      .status(500)
      .json({ message: 'Unable to insert data due to server error.' });
  }

  res.status(201).json({ message: 'Created user!' });
  client.close();
}

export default handler;
