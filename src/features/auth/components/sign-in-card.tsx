import { FcGoogle } from 'react-icons/fc';
import { TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { FaGithub } from 'react-icons/fa';
import { SignInFlow } from '../type';
import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const onPasswordSignin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);
    signIn('password', { email, password, flow: 'signIn' })
      .then(() => {
        window.open('/homepage');
      })
      .catch(() => {
        setError('Invalid email or password');
      })
      .finally(() => {
        setPending(false);
      });
  };

  const handleProviderSignin = (value: 'github' | 'google') => {
    setPending(false);
    signIn(value).finally(() => setPending(false));
  };

  return (
    <div className="w-full h-full p-8">
      {!!error && (
        <div className=" bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <div className="space-y-10 px-0 pb-0">
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            onClick={() => handleProviderSignin('google')}
            variant={'outline'}
            size={'lg'}
            className="w-full relative text-lg"
          >
            <FcGoogle className="size-8" />
            Sign In With Google
          </Button>
          <Button
            disabled={pending}
            onClick={() => handleProviderSignin('github')}
            variant={'outline'}
            size={'lg'}
            className="w-full relative text-lg"
          >
            <FaGithub className="size-8" />
            Sign In With Github
          </Button>
        </div>

        <Separator />
        <form onSubmit={onPasswordSignin} className="space-y-2.5">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Button
            type="submit"
            className="w-full bg-[#611f69] text-lg"
            size={'lg'}
            disabled={pending}
          >
            Sign in with Email
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <span
            onClick={() => setState('signUp')}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignInCard;
