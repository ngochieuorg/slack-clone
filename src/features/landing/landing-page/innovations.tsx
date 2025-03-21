'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { innovationsData } from '@/constant';

export default function InnovationsGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(
    innovationsData[0].id
  );
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className=" hidden lg:flex gap-4 justify-center items-center w-full max-w-7xl mx-auto p-4">
      {innovationsData.map((item) => {
        const isHovered = hoveredId === item.id;

        return (
          <motion.div
            key={item.id}
            layoutId={item.id}
            className={`relative h-[320px] overflow-hidden rounded-2xl cursor-pointer transition-all ${
              isHovered ? 'w-[42%]' : 'w-[15%]'
            }`}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => {
              setIsExpanded(false); // Reset trạng thái khi không hover nữa
            }}
            initial={{ opacity: 0.8 }}
            animate={{
              width: isHovered ? '42%' : '15%',
              transition: { type: 'spring', stiffness: 120, damping: 15 },
            }}
            whileHover={{ scale: 1.0 }}
            onAnimationComplete={() => {
              if (isHovered) {
                setTimeout(() => {
                  setIsExpanded(true);
                }, 1000);
              }
            }}
          >
            {/* Video hoặc Thumbnail */}
            {isHovered ? (
              <motion.video
                src={item.links[0]}
                autoPlay
                loop
                muted
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.5 } }}
                exit={{ opacity: 0 }}
              />
            ) : (
              <motion.div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${item.thumbnail})` }}
                initial={{ filter: 'blur(2px)', opacity: 0.8 }}
                animate={{
                  filter: 'blur(0px)',
                  opacity: 1,
                  transition: { duration: 0.5 },
                }}
              />
            )}

            {/* 🔥 Lớp Overlay Tối */}
            <motion.div
              className="absolute inset-0 bg-black transition-opacity"
              initial={{ opacity: isHovered ? 0.4 : 0.6 }}
              animate={{
                opacity: isHovered ? 0.4 : 0.6,
                transition: { duration: 0.5 },
              }}
            />

            {/* Logo */}
            <motion.div
              className={`absolute inset-0 flex items-center transition-all ${
                isHovered ? 'top-4 left-4 justify-start' : 'justify-center'
              }`}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1, transition: { duration: 0.5 } }}
            >
              <Image
                src={item.logo}
                alt={`${item.title} Logo`}
                width={isHovered ? 100 : 80}
                height={isHovered ? 100 : 80}
                className="transition-all duration-300"
              />
            </motion.div>

            {/* Tiêu đề */}
            <AnimatePresence>
              {isHovered && isExpanded && (
                <motion.div
                  className="absolute bottom-4 left-4 text-white font-semibold text-lg w-3/4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  {item.title}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
