import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { verifyPassword } from '../../../helpers/auth';
import { connectDB } from '../../../helpers/db';

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectDB();

        const usersCollection = client.db().collection('users');
        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error('No user found!');
        }

        const isPasswordVerified = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isPasswordVerified) {
          client.close();
          throw new Error('Unable to log in.');
        }

        client.close();

        return {
          email: user.email,
        };
      },
    }),
  ],
});
