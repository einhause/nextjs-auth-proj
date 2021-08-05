import { useState, useRef } from 'react';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { createUser } from '../../helpers/auth';
import classes from './auth-form.module.css';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const emailRef = useRef();
  const passwordRef = useRef();

  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitLoginHandler(e) {
    e.preventDefault();

    const enteredEmail = emailRef.current.value;
    const enteredPass = passwordRef.current.value;

    let resultData;

    if (isLogin) {
      resultData = await signIn('credentials', {
        redirect: false,
        email: enteredEmail,
        password: enteredPass,
      });

      if (!resultData.error) {
        router.replace('/profile');
      }
    } else {
      resultData = await createUser(enteredEmail, enteredPass);
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitLoginHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' ref={passwordRef} required />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
