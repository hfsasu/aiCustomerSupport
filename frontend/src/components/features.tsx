"use client";
import { MotionValue, useScroll, motion, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { IconType } from "react-icons";
import {
  FiArrowRight,
  FiShoppingCart,
  FiMenu,
  FiHeadphones,
} from "react-icons/fi";
import { MdRestaurantMenu } from "react-icons/md";
import { useTheme } from "next-themes";

export const StickyCards = () => {
  const ref = useRef(null);
  const { theme } = useTheme();
  const containerBg = theme === "dark" ? "bg-black" : "bg-white";
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Set container height to the sum of all card heights
  const containerHeight = CARD_HEIGHT * CARDS.length;

  return (
    <>
      <div
        ref={ref}
        className={`relative ${containerBg}`}
        style={{ height: `${containerHeight}px` }}
      >
        {CARDS.map((c, idx) => (
          <Card
            key={c.id}
            card={c}
            scrollYProgress={scrollYProgress}
            position={idx + 1}
          />
        ))}
      </div>
    </>
  );
};

interface CardProps {
  position: number;
  card: CardType;
  scrollYProgress: MotionValue;
}

const Card = ({ position, card, scrollYProgress }: CardProps) => {
  const scaleFromPct = (position - 1) / CARDS.length;
  // For the last card, we set y to 0 so it doesn't scroll away
  const y =
    position === CARDS.length
      ? 0
      : useTransform(scrollYProgress, [scaleFromPct, 1], [0, -CARD_HEIGHT]);

  const isOddCard = position % 2;

  return (
    <motion.div
      style={{
        height: CARD_HEIGHT,
        y: y,
        background: isOddCard ? "black" : "white",
        color: isOddCard ? "white" : "black",
      }}
      className="sticky top-0 flex w-full origin-top flex-col items-center justify-center px-4"
    >
      <card.Icon className="mb-4 text-4xl" />
      <h3 className="mb-6 text-center text-4xl font-semibold md:text-6xl">
        {card.title}
      </h3>
      <p className="mb-8 max-w-lg text-center text-sm md:text-base">
        {card.description}
      </p>
      <a
        href={card.routeTo}
        className={`transform scale-75 flex items-center gap-2 rounded px-6 py-4 text-base font-medium uppercase text-black transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 md:text-lg ${
          card.ctaClasses
        } ${
          isOddCard
            ? "shadow-[4px_4px_0px_white] hover:shadow-[8px_8px_0px_white]"
            : "shadow-[4px_4px_0px_black] hover:shadow-[8px_8px_0px_black]"
        }`}
      >
        <span>{card.ctaText}</span>
        <FiArrowRight />
      </a>
    </motion.div>
  );
};

const CARD_HEIGHT = 500;

type CardType = {
  id: number;
  Icon: IconType;
  title: string;
  description: string;
  ctaClasses: string;
  routeTo: string;
  ctaText: string;
};

const CARDS: CardType[] = [
  {
    id: 1,
    Icon: FiShoppingCart,
    title: "Fast & Easy Ordering",
    description:
      "Place your order in seconds with our AI-powered assistant guiding you through every step for a seamless experience.",
    ctaClasses: "bg-red-500",
    routeTo: "#",
    ctaText: "Order Now",
  },
  {
    id: 2,
    Icon: MdRestaurantMenu,
    title: "Diverse Menu Options",
    description:
      "Explore a wide range of meal options and customize your order with intelligent suggestions tailored to your preferences.",
    ctaClasses: "bg-red-500",
    routeTo: "#",
    ctaText: "View Menu",
  },
  {
    id: 3,
    Icon: FiHeadphones,
    title: "24/7 Customer Support",
    description:
      "Our AI service is available around the clock to assist with inquiries, order changes, and any other questions you may have.",
    ctaClasses: "bg-red-500",
    routeTo: "#",
    ctaText: "Contact",
  },
];
