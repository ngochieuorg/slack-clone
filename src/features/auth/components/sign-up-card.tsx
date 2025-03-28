import { FcGoogle } from 'react-icons/fc';
import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { FaGithub } from 'react-icons/fa';
import { SignInFlow } from '../type';
import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const onPasswordSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setPending(true);
    signIn('password', { email, password, name, flow: 'signUp' })
      .catch(() => {
        setError('Something went wrong');
      })
      .finally(() => {
        setPending(false);
      });
  };

  const handleProviderSignup = (value: 'github' | 'google') => {
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
        <form onSubmit={onPasswordSignup} className="space-y-2.5">
          <Input
            disabled={pending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
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
          <Input
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            type="password"
            required
          />
          <Button
            type="submit"
            className="w-full bg-[#611f69] text-lg"
            size={'lg'}
            disabled={false}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            onClick={() => handleProviderSignup('google')}
            variant={'outline'}
            size={'lg'}
            className="w-full relative text-lg"
          >
            <FcGoogle className="size-5" />
            Continue with Google
          </Button>
          <Button
            disabled={pending}
            onClick={() => handleProviderSignup('github')}
            variant={'outline'}
            size={'lg'}
            className="w-full relative text-lg"
          >
            <FaGithub className="size-5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{' '}
          <span
            onClick={() => setState('signIn')}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpCard;
