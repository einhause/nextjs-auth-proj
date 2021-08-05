import AuthForm from '../components/auth/auth-form';
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';

function AuthPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/profile');
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return <AuthForm />;
}

export default AuthPage;
