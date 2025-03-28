import { CloudDownload } from 'lucide-react';
import Image from 'next/image';

export function AllRightsReserved() {
  return (
    <footer className="w-full border-t border-gray-300 bg-white py-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-4">
        {/* Logo + Navigation */}
        <div className="flex flex-col lg:flex-row items-center gap-2">
          <Image
            src="/slack-logo.png"
            alt="Slack Logo"
            width={40}
            height={40}
            className=" self-start"
          />

          <nav className="flex gap-3 text-gray-600 text-sm flex-wrap">
            <a
              href="#"
              className="text-sky-600 font-medium flex items-center space-x-1"
            >
              <span>Download Slack</span>
              <CloudDownload size={14} />
            </a>
            <a href="#" className="hover:underline hover:text-sky-600">
              Privacy
            </a>
            <a href="#" className="hover:underline hover:text-sky-600">
              Terms
            </a>
            <a href="#" className="hover:underline hover:text-sky-600">
              Cookie Preferences
            </a>
            <a
              href="#"
              className="hover:underline hover:text-sky-600 flex items-center space-x-1"
            >
              <span>Your Privacy Choices</span>
              <span className="text-blue-600">⚖️</span>
            </a>
          </nav>
        </div>

        {/* Copyright */}
        <p className="text-gray-500 text-xs text-left lg:text-center">
          ©2025 Slack Technologies, LLC, a Salesforce company. All rights
          reserved. Various trademarks held by their respective owners.
        </p>
      </div>
    </footer>
  );
}
