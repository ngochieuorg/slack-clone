'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa';
import {
  articles,
  awards,
  featuresData,
  landingBrandsLogo,
  plans,
  successes,
} from '@/constant';
import LandingHeader from '../landing-header';
import { AllRightsReserved } from '../all-right-reserved';
import { FooterAccordion, FooterGrid } from '../footer';
import { ArrowRight, Check } from 'lucide-react';
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
      <div className="landing-page overflow-hidden px-4 pt-20 lg:pl-8 w-full flex flex-col gap-12 items-center">
        <LandingHeader mode="dark" />
        <div>
          <Image
            className="block lg:hidden"
            src={'/image/landing/headline.png'}
            alt="Headline"
            width={1000}
            height={1000}
          />
          <video
            className="w-full h-full object-cover z-10 hidden lg:block"
            autoPlay
            // loop
            muted
            playsInline
          >
            <source src={'videos/hp-headline@2x.mp4'} type={`video/mp4`} />
            <source src={'videos/hp-headline@2x.webm'} type={`video/webm`} />
            Your browser does not support
          </video>
        </div>
        <LandingAction />
        <div className="flex flex-wrap gap-8 lg:gap-20 justify-center items-center">
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
        <PricingPlans />
        <LandingAction noDes />
        <GrowData />
        <Award />
        <Articles />
        <Accomplish />
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
  isVideoVisible: boolean;
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
  isVideoVisible,
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
      <div className="relative xl:opacity-0">
        <div
          className={cn(
            'relative w-full max-w-3xl xl:max-w-7xl h-auto overflow-hidden rounded-2xl shadow-lg z-10',
            'transition-opacity duration-700',

            isActive
              ? 'opacity-100 xl:scale-100 '
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
      <div
        className={cn(
          'relative xl:fixed xl:top-1/4 xl:left-1/2',
          isVideoVisible ? 'opacity-100' : 'opacity-0 hidden'
        )}
      >
        <div
          className={cn(
            'relative w-full xl:max-w-2xl h-auto overflow-hidden rounded-2xl shadow-lg z-10',
            'transition-opacity duration-700',

            isActive
              ? 'opacity-100 xl:scale-100 '
              : 'opacity-100 scale-100 xl:opacity-0 xl:scale-0'
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
            'z-0 absolute -bottom-[17%] left-[45%]',
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
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (visibleSection) {
          const id = visibleSection.target.id;
          const video = featuresData.find((v) => v.id === id);
          if (video) {
            setActiveSection(video.id);
            setIsVideoVisible(true);
          }
        } else {
          setIsVideoVisible(false);
        }
      },
      { threshold: 0.9 } // 60% section vào viewport thì thay đổi video
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
            isVideoVisible={isVideoVisible}
          />
        );
      })}
    </div>
  );
};

const PricingPlans = () => {
  return (
    <div className="container mx-auto py-12 text-center max-w-6xl">
      <h2 className="text-5xl font-bold mb-4">
        There’s a plan for every kind of team.
      </h2>
      <p className="text-gray-600 mt-2 text-lg font-semibold">
        Start with a premium plan, or try the free version.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {plans.map((plan) => (
          <Card key={plan.name} className="p-2 px-2 text-left">
            <CardContent className="px-2 flex flex-col h-full">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-gray-600 mt-2">{plan.description}</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-4 text-blue-600" /> {feature}
                  </li>
                ))}
              </ul>
              {plan.extra && (
                <p className=" text-blue-600 font-medium mt-auto">
                  ✨ {plan.extra}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const LandingAction = ({ noDes }: { noDes?: boolean }) => {
  return (
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
      {!noDes && (
        <p className="text-center text-lg">
          <span className="font-semibold">Slack is free to try</span> for as
          long as you’d like
        </p>
      )}
    </div>
  );
};

const GrowData = () => {
  return (
    <div className="w-screen h-[90vh] relative bg-[#481a54] flex justify-center items-center text-white text-center py-16 px-4">
      <div className="w-full block h-10 bg-[#481a54] absolute -top-10 left-0">
        <div
          style={{ clipPath: 'ellipse(65% 200% at 50% -105%)' }}
          className="w-full block h-10 bg-[white] absolute top-0 left-0"
        ></div>
      </div>
      <div>
        <h2 className="text-4xl lg:text-6xl font-semibold mb-8">
          We’re in the business of growing businesses.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div>
            <p className="text-7xl font-bold text-purple-300">54%</p>
            <p className="mt-2 text-2xl font-semibold">
              of users say Slack helps them stay more connected<sup>5</sup>
            </p>
          </div>
          <div>
            <p className="text-7xl font-bold text-purple-300">26</p>
            <p className="mt-2 text-2xl font-semibold">
              The average number of apps used by teams in Slack<sup>3</sup>
            </p>
          </div>
          <div>
            <p className="text-7xl font-bold text-purple-300">52%</p>
            <p className="mt-2 text-2xl font-semibold">
              of users say Slack helps them collaborate more efficiently
              <sup>5</sup>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Award = () => {
  return (
    <div className="px-8">
      <h2 className="text-4xl font-bold text-center mb-10">
        Millions of people love to work in Slack.
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="space-y-16 ">
          {successes.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center justify-start gap-4"
            >
              <span className="text-5xl font-bold min-w-[140px] text-center md:text-right">
                {item.number}
              </span>
              <span className=" text-gray-600 w-72 text-center md:text-left">
                {item.text}
              </span>
            </div>
          ))}
        </div>
        <Separator orientation="vertical" />
        <div className="text-center md:text-left">
          <h3 className="text-4xl font-bold mb-4">
            Don’t just take our word for it.
          </h3>
          <p className="text-gray-600 mb-6 text-lg font-semibold">
            Slack is a leader in over 150 G2 market reports.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {awards.map((src, index) => (
              <div key={index} className="flex justify-center">
                <Image
                  src={src}
                  alt="Award Badge"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Articles = () => {
  return (
    <div className="max-w-7xl py-12 px-6 md:px-16">
      <h2 className="text-3xl font-bold text-center mb-10">
        Your Slack deep dive starts here.
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white shadow-lg rounded-lg p-2 flex flex-col gap-4 hover:scale-110 duration-500 cursor-pointer"
          >
            <Image
              src={article.image}
              alt={article.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />

            <span className="text-sm text-gray-500">{article.category}</span>
            <h3 className="text-2xl font-bold mt-2 ">{article.title}</h3>
            <a
              href={article.link}
              className="flex items-center text-blue-600 font-semibold mt-auto"
            >
              READ MORE <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

const Accomplish = () => {
  return (
    <div
      style={{ clipPath: 'ellipse(75% 100% at top)' }}
      className="w-screen relative bg-[#481a54] flex justify-center items-center text-white text-center py-16 px-4"
    >
      <div>
        <h2 className="text-4xl lg:text-6xl font-semibold mb-8">
          See all you can accomplish in Slack.
        </h2>
        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4 ">
          <Button className="px-4 py-2 text-[#481a54] bg-[white] hover:text-white w-52 h-14">
            GET STARTED
          </Button>
          <Button
            variant={'outline'}
            className=" border text-[white] border-[white] bg-transparent w-52 h-14"
          >
            TALK TO SALES
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingHomepage;
