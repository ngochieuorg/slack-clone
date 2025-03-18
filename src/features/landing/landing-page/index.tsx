'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa';
import { brandsLogo } from '@/constant';
import LandingHeader from '../landing-header';
import { AllRightsReserved } from '../all-right-reserved';
import { FooterAccordion, FooterGrid } from '../footer';
import LandingPageLayout from './landing-page-layout';

const LandingHomepage = () => {
  return (
    <LandingPageLayout>
      <div className="flex flex-col items-center">
        <div className="home-page px-8 pb-[200px] w-full bg-[#481349] flex flex-col gap-12 items-center">
          <LandingHeader />
          <div className="w-full max-w-4xl p-4 pb-0 bg-white rounded-md ring-4 ring-[#fff3] xl:flex xl: justify-between xl:flex-row-reverse xl:items-center">
            <div className="flex flex-col xl:flex-row gap-4">
              <p className="font-semibold text-lg mb-4">
                Want to use Slack with a different team?
              </p>
              <Button
                variant="outline"
                className="w-full h-12 text-[#481349] border border-[#481349]"
                onClick={() => {}}
              >
                CREATE A NEW WORKSPACE
              </Button>
            </div>
            <div className="relative top-8 -left-4  xl:left-0">
              <Image
                height={200}
                width={200}
                alt="women with laptop"
                src="/image/home/woman-with-laptop.png"
              />
            </div>
          </div>
        </div>
        <div className="max-w-4xl relative -top-[100px] mx-16 flex flex-col gap-8">
          <Blog
            link=""
            title={'Get more out of Slack'}
            description="Work moves faster with unlimited messages in search, external partners in channels and more."
            action="Upgrade now"
            subTitle="SLACK PAID PLANS"
            image="/image/home/get-more-slack-bike.png"
          />
          <div className="flex flex-wrap gap-8 justify-center items-center">
            {brandsLogo.map((logo, idx) => {
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={idx}
                  height={40}
                  width={'auto'}
                  alt="women with laptop"
                  src={`/image/brands/${logo}`}
                />
              );
            })}
          </div>
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
    </LandingPageLayout>
  );
};

interface BlogProps {
  link?: string;
  title: string;
  subTitle?: string;
  description?: string;
  image: string;
  action: string;
  className?: string;
}

const Blog = ({
  link,
  subTitle,
  title,
  image,
  action,
  description,
  className,
}: BlogProps) => {
  return (
    <div className={cn(' bg-white shadow-lg md:flex', className)}>
      <Image src={image} alt="blog" width={400} height={250} />
      <div className="flex flex-col gap-4 p-8">
        <h6 className="font-semibold text-lg">{subTitle}</h6>
        <h6 className="font-bold text-3xl">{title}</h6>
        <p className="text-lg">{description}</p>
        <Link href={link || ''} className="text-sky-700 text-lg cursor-pointer">
          {action}
        </Link>
      </div>
    </div>
  );
};

export default LandingHomepage;
