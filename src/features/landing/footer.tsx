import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Image from 'next/image';

import { menuData } from '@/constant';

export function FooterAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {menuData.map((section) => (
        <AccordionItem key={section.group} value={section.group.toLowerCase()}>
          <AccordionTrigger>{section.group}</AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-2">
              {section.items.map((item) => (
                <li
                  key={item.label}
                  className="text-muted-foreground hover:text-sky-600 "
                >
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function FooterGrid() {
  return (
    <div className="max-w-6xl mx-auto p-8 flex gap-12">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Image src="/slack-logo.png" alt="Slack Logo" width={50} height={50} />
      </div>

      {/* Menu Items */}
      <div className="flex flex-wrap w-full justify-between">
        <div className="w-1/5">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">PRODUCT</h3>
            <ul className="text-gray-600 space-y-1">
              {menuData
                .find((group) => group.group === 'PRODUCT')
                ?.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="hover:underline hover:text-sky-600"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
          <div className="mt-6">
            <h3 className="font-bold text-gray-800 mb-2">WHY SLACK?</h3>
            <ul className="text-gray-600 space-y-1">
              {menuData
                .find((group) => group.group === 'WHY SLACK?')
                ?.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="hover:underline hover:text-sky-600"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        {menuData
          .filter(
            (group) => group.group !== 'PRODUCT' && group.group !== 'WHY SLACK?'
          )
          .map((section) => (
            <div key={section.group} className="w-1/6">
              <h3 className="font-bold text-gray-800 mb-2">{section.group}</h3>
              <ul className="text-gray-600 space-y-1">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="hover:underline hover:text-sky-600"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}
