'use client';

import { useEffect, useMemo, useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

import { useConvexAuth } from 'convex/react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface LandingHeaderProps {
  mode?: 'light' | 'dark';
}

export default function LandingHeader({ mode = 'light' }: LandingHeaderProps) {
  const [mod, setMod] = useState<'light' | 'dark'>(mode);
  const [isSticky, setIsSticky] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
      setIsSticky(window.scrollY > 80);
      if (window.scrollY > 80) {
        setMod('dark');
      } else {
        setMod(mode);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mod, mode]);

  return (
    <HeaderWrapper isSticky={isSticky} mode={mod} isScrolled={isScrolled}>
      <Content mode={mod} />
    </HeaderWrapper>
  );
}

const HeaderWrapper = ({
  children,
  isSticky,
  mode,
  isScrolled,
}: {
  children: React.ReactNode;
  isSticky: boolean;
  mode: 'light' | 'dark';
  isScrolled: boolean;
}) => {
  return (
    <div
      className={cn(
        'max-w-[1200px] p-4 flex justify-between items-center font-semibold fixed top-0 left-0 right-0 mx-auto z-[999] transition-transform duration-300',
        isSticky ? 'shadow-md lg:rounded-full top-2' : '',
        isScrolled ? 'translate-y-0' : 'translate-y-0',
        mode === 'light' ? 'text-white' : 'text-slate-900 bg-white'
      )}
    >
      {children}
    </div>
  );
};

const Content = ({ mode }: { mode: 'light' | 'dark' }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isLoading: isLoadingAuthenticated } =
    useConvexAuth();
  const buttonOutlineStyle = useMemo(
    () =>
      cn(
        'px-4 py-2',
        mode === 'light' && 'text-white border border-[white] bg-transparent',
        mode === 'dark' && 'text-[#481349] border-[#481349]'
      ),
    [mode]
  );

  const buttonDefaultStyle = useMemo(
    () =>
      cn(
        'px-4 py-2',
        mode === 'light' && ' border bg-[white] text-[#481349]',
        mode === 'dark' && 'text-white bg-[#481349]'
      ),
    [mode]
  );
  return (
    <>
      {/* Logo */}
      <Image
        src={
          mode === 'dark'
            ? '/slack-salesforce-black.png'
            : '/slack-salesforce.png'
        }
        alt="Slack Logo"
        width={100}
        height={100}
      />
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex space-x-6">
        <a href="#" className="hover:underline">
          Features
        </a>
        <a href="#" className="hover:underline">
          Solutions
        </a>
        <a href="#" className="hover:underline">
          Enterprise
        </a>
        <a href="#" className="hover:underline">
          Resources
        </a>
        <a href="#" className="hover:underline">
          Pricing
        </a>
      </nav>
      {/* Right side buttons */}
      <div className="hidden lg:flex space-x-4">
        {!isAuthenticated && !isLoadingAuthenticated && (
          <Button
            variant={'link'}
            className={cn(
              mode === 'light' && 'text-white',
              mode === 'dark' && 'text-slate-900'
            )}
            onClick={() => router.push('/auth')}
          >
            Sign in
          </Button>
        )}
        <Button
          variant={'outline'}
          className={cn(buttonOutlineStyle, 'hidden xl:block')}
        >
          REQUEST A DEMO
        </Button>
        {isAuthenticated && (
          <Button variant={'default'} className={buttonDefaultStyle}>
            CREATE A NEW WORKSPACE
          </Button>
        )}
        {!isAuthenticated && (
          <Button variant={'default'} className={buttonDefaultStyle}>
            GET STARTED
          </Button>
        )}
      </div>
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center gap-4">
        <Search className="w-6 h-6 cursor-pointer" />
        <button onClick={() => setIsOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>
      {/* Mobile Menu Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-[999]">
          <div className="bg-white w-full h-full p-6 shadow-lg flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <Image
                src="/slack-logo.png"
                alt="Slack Logo"
                width={50}
                height={50}
              />
              <button onClick={() => setIsOpen(false)}>
                <X className="w-6 h-6 text-slate-800" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4 text-purple-900">
              <a href="#" className="hover:underline">
                Features
              </a>
              <a href="#" className="hover:underline">
                Solutions
              </a>
              <a href="#" className="hover:underline">
                Enterprise
              </a>
              <a href="#" className="hover:underline">
                Resources
              </a>
              <a href="#" className="hover:underline">
                Pricing
              </a>
            </nav>
            <div className="flex gap-4 mt-auto">
              <Button
                variant={'outline'}
                className=" text-[#481349] border border-[#481349] flex-1"
              >
                TALK TO SALES
              </Button>
              <Button variant={'default'} className=" bg-[#481349] flex-1">
                DOWNLOAD SLACK
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
