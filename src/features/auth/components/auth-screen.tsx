'use client';

import React, { useState } from 'react';
import { SignInFlow } from '../type';
import SignInCard from './sign-in-card';
import SignUpCard from './sign-up-card';
import Image from 'next/image';

const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>('signIn');
  return (
    <div className="h-full flex flex-col items-center justify-start pt-20 gap-2">
      <Image
        src={'/slack-salesforce-black.png'}
        alt="Slack Logo"
        width={100}
        height={100}
      />
      <h6 className="text-5xl font-bold text-center">
        {state === 'signIn' ? 'Sign in to Slack' : 'Sign up to Slack'}
      </h6>
      <p>
        We suggest using the{' '}
        <span className="font-semibold">email address you use at work.</span>
      </p>
      <div className="md:h-auto w-full max-w-[420px]">
        {state === 'signIn' ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
