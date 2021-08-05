// import { getSession } from 'next-auth/client';
// import { useState, useEffect } from 'react';
import ProfileForm from './profile-form';
import classes from './user-profile.module.css';
import axios from 'axios';

function UserProfile() {
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   getSession().then((session) => {
  //     if (!session) {
  //       window.location.href = '/auth';
  //     } else {
  //       setLoading(false);
  //     }
  //   });
  // }, []);

  // if (loading) {
  //   return <p className={classes.profile}>Loading...</p>;
  // }

  async function changePasswordHandler(passwordData) {
    const reqHeaders = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.patch(
      '/api/user/change-password',
      passwordData,
      reqHeaders
    );

    const data = res.data;
    console.log(data);
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePasswordHandler} />
    </section>
  );
}

export default UserProfile;
