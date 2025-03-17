import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full text-white p-4 flex justify-between items-center ">
      {/* Logo */}
      <Image
        src="/slack-salesforce.png"
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
        <button className="border border-white px-4 py-2 rounded">
          Request a Demo
        </button>
        <button className="bg-white text-[#481349] px-4 py-2 rounded font-semibold">
          Create a New Workspace
        </button>
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
    </header>
  );
}
