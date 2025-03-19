'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa';
import { featuresData, landingBrandsLogo } from '@/constant';
import LandingHeader from './landing-header';
import { AllRightsReserved } from './all-right-reserved';
import { FooterAccordion, FooterGrid } from './footer';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Collaboration from '@/asset/svg/collaboration';
import ProjectManagement from '@/asset/svg/project-management';
import LightNing from '@/asset/svg/lightning';
import Star from '@/asset/svg/star';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import FeatureBg from '@/asset/svg/feature-bg';

const LandingHomepage = () => {
  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="landing-page px-4 lg:pl-8 w-full flex flex-col gap-12 items-center">
        <LandingHeader mode="dark" />
        <div>
          <Image
            src={'/image/landing/headline.png'}
            alt="Headline"
            width={300}
            height={100}
          />
        </div>
        <div className="w-full max-w-3xl flex flex-col items-center gap-4 ">
          <Button className="px-4 py-2 text-white bg-[#481349] w-72 h-14">
            GET STARTED
          </Button>
          <Button
            variant={'outline'}
            className=" border text-[#481349] border-[#481349] w-72 h-14"
          >
            FIND YOUR PLAN
            <ArrowRight className="size-5" />
          </Button>
          <p className="text-center text-lg">
            <span className="font-semibold">Slack is free to try</span> for as
            long as you’d like
          </p>
        </div>
        <div className="flex flex-wrap gap-8 justify-center items-center">
          {landingBrandsLogo.map((logo, idx) => {
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={idx}
                height={20}
                width={'auto'}
                alt="women with laptop"
                src={`/image/brands/${logo}`}
                className="h-[28px]"
              />
            );
          })}
        </div>
        <div className="max-w-3xl flex flex-col gap-8 items-center justify-center">
          <div className="relative w-full  h-auto overflow-hidden rounded-2xl shadow-lg">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/videos/hero@2x.webm" type="video/webm" />
              <source src="/videos/hero@2x.mp4" type="video/mp4" />
              Your browser does not support
            </video>
          </div>
          <p className="text-center text-3xl font-bold lg:text-4xl">
            Your people, projects, apps, and AI, all on the world’s most beloved
            work operating system.
          </p>
          <div className="hidden lg:flex items-center uppercase font-semibold gap-8">
            <div className="flex gap-2 items-center">
              <Collaboration />
              <span>Collaboration</span>
            </div>
            <div className="flex gap-2 items-center">
              <ProjectManagement />
              <span>Project management</span>
            </div>
            <div className="flex gap-2 items-center">
              <LightNing />
              <span>integrations</span>
            </div>
            <div className="flex gap-2 items-center">
              <Star />
              <span>Slack AI</span>
            </div>
          </div>
        </div>
        <FeatureBlocks />
        <div className="flex justify-center gap-8 mt-20">
          <FaLinkedinIn className="size-5 cursor-pointer" />
          <FaInstagram className="size-5 cursor-pointer" />
          <FaFacebook className="size-5 cursor-pointer" />
          <FaYoutube className="size-5 cursor-pointer" />
          <FaTiktok className="size-5 cursor-pointer" />
        </div>
        <Separator />
      </div>

      <div className="w-full px-8">
        <div className="block xl:hidden">
          <FooterAccordion />
        </div>
        <div className="hidden xl:block">
          <FooterGrid />
        </div>
        <AllRightsReserved />
      </div>
    </div>
  );
};

interface FeatureBlockProps {
  id: string;
  header: string;
  title: string;
  description: string;
  subDescription: string;
  numberChange: string;
  links: string[];
  isActive: boolean;
  bgColor: string;
}

const FeatureBlock = ({
  id,
  header,
  title,
  description,
  subDescription,
  numberChange,
  links,
  isActive,
  bgColor,
}: FeatureBlockProps) => {
  return (
    <div
      id={id}
      className={cn(
        'w-full flex flex-col xl:flex-row gap-8 items-center py-12'
      )}
    >
      <div className="w-full flex flex-col gap-4 items-start">
        <p className="text-sm uppercase font-semibold">{header}</p>
        <p className="text-4xl font-semibold">{title}</p>
        <p style={{ whiteSpace: 'p' }}>{description}</p>
        <div className="flex gap-2 items-center">
          <p className="text-5xl font-semibold text-[#9602c7]">
            {numberChange}
          </p>
          <p className=" whitespace-pre-line">{subDescription}</p>
        </div>
      </div>
      <div className="relative">
        <div
          className={cn(
            'relative w-full max-w-3xl xl:max-w-7xl h-auto overflow-hidden rounded-2xl shadow-lg z-10',
            'transition-opacity duration-700',
            isActive
              ? 'opacity-100 md:scale-100'
              : 'opacity-100 scale-100 xl:opacity-0 xl:scale-90'
          )}
        >
          <video
            className="w-full h-full object-cover z-10"
            autoPlay
            loop
            muted
            playsInline
          >
            {links.map((link) => {
              return (
                <source
                  key={link}
                  src={link}
                  type={`video/${link.split('.')[1]}`}
                />
              );
            })}
            Your browser does not support
          </video>
        </div>
        <FeatureBg
          color={bgColor}
          className={cn(
            'z-0 absolute -bottom-[17%] left-[35%]',
            'transition-opacity duration-700',
            isActive ? 'opacity-100' : 'opacity-100 xl:opacity-0 '
          )}
        />
      </div>
    </div>
  );
};

const FeatureBlocks = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    featuresData.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-7xl">
      {featuresData.map((feature) => {
        return (
          <FeatureBlock
            key={feature.id}
            isActive={activeSection === feature.id}
            {...feature}
          />
        );
      })}
    </div>
  );
};

export default LandingHomepage;
