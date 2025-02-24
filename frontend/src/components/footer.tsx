"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const navigation = [
    { name: "About", href: "https://www.in-n-out.com/history" },
    { name: "Menu", href: "https://www.in-n-out.com/menu#doubledouble" },
    { name: "Locations", href: "https://www.in-n-out.com/locations" },
    { name: "Contact", href: "https://www.in-n-out.com/contact" },
  ];

  const social = [
    { name: "Facebook", href: "https://www.facebook.com/innout/", icon: Facebook },
    { name: "Instagram", href: "https://www.instagram.com/innout/?hl=en", icon: Instagram },
    { name: "Twitter", href: "https://x.com/innoutburger?", icon: Twitter },
    { name: "YouTube", href: "https://www.youtube.com/results?search_query=in+n+out", icon: Youtube },
  ];

  return (
    <footer className={`relative mt-auto border-t-2 border-[#C8102E] dark:border-[#C8102E] ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="relative group">
            <Image
              src="/restaurantLogo.png"
              alt="In-N-Out Burger"
              width={128}
              height={128}
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex justify-center space-x-12 mb-8">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm transition-colors duration-200 ${
                isDark
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-[#C8102E]'
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Social Links */}
        <div className="flex justify-center space-x-8 mb-8">
          {social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors duration-200 ${
                isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-500 hover:text-[#C8102E]'
              }`}
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </a>
          ))}
        </div>

        {/* Message */}
        <p className={`text-center text-sm mb-6 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Order with our AI assistant and experience the future of fast food.
        </p>

        {/* Legal */}
        <div className="flex justify-center items-center space-x-4 text-xs mb-4">
          <a
            href="https://www.in-n-out.com/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-200 ${
              isDark
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-500 hover:text-[#C8102E]'
            }`}
          >
            Privacy Policy
          </a>
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>•</span>
          <a
            href="https://www.in-n-out.com/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-200 ${
              isDark
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-500 hover:text-[#C8102E]'
            }`}
          >
            Terms of Service
          </a>
        </div>

        {/* Copyright */}
        <p className={`text-center text-xs ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          © {new Date().getFullYear()} In-N-Out Burger. All rights reserved.
        </p>
      </div>
    </footer>
  );
}