import { getSession } from 'next-auth/client';
import { connectDB } from '../../../helpers/db';
import { verifyPassword, saltAndHash } from '../../../helpers/auth';
import { passwordRegex } from '../../../helpers/regexs';

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getSession({ req: req });

  if (!session) {
    res
      .status(401)
      .json({ message: 'Security error: Unable to reset password' });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const isPasswordValid = passwordRegex.test(newPassword);
  if (!isPasswordValid) {
    res
      .status(422)
      .json({ message: 'New password must meet requirements, try again.' });
    return;
  }

  const client = await connectDB();
  const usersCollection = client.db().collection('users');

  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    client.close();
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const currentPassword = user.password;
  const arePasswordsEqual = await verifyPassword(oldPassword, currentPassword);

  if (!arePasswordsEqual) {
    client.close();
    res
      .status(403) //authorized, but not authenticated
      .json({ message: 'Security error: Unable to reset password' });
    return;
  }

  const encryptedPassword = await saltAndHash(newPassword);

  await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: encryptedPassword } }
  );

  client.close();
  res.status(200).json({ message: 'Password successfully updated!' });
}
export default handler;
