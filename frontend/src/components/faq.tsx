"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from 'lucide-react';
import { useTheme } from "next-themes";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does the AI ordering system work?",
    answer:
      "Our AI-powered assistant guides you through every step of the ordering process. Just tell it what you'd like and it will help customize your meal and complete your purchase in seconds.",
  },
  {
    question: "What menu options are available?",
    answer:
      "We offer a diverse range of fast-food options. From classic burgers and fries to healthier and vegetarian alternatives. Our AI assistant can even suggest dishes based on your personal taste.",
  },
  {
    question: "How does customer support work?",
    answer:
      "Our service is available 24/7. Whether you have a question about your order or need help with customization, our AI agent is ready to assist you at any time.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes, we use industry-standard encryption and secure payment processing. Your payment information is never stored on our servers and is handled through trusted payment providers.",
  },
  {
    question: "Can I customize my order?",
    answer:
      "Our AI assistant can help you customize any menu item according to your preferences, dietary restrictions, or taste preferences. Just let it know what you'd like to modify.",
  },
];

export function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div 
      id="faq"
      className={`relative w-full py-4 md:py-8 lg:py-10 border-t-2 border-[#C8102E] ${
        isDark ? 'bg-black' : 'bg-white'
      }`}
    >
      {/* Dynamic Background */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-b from-black via-[#C8102E]/10 to-black' 
          : 'bg-white'
      }`}>
        {/* Animated gradient overlay for dark mode */}
        {isDark && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C8102E]/5 via-transparent to-transparent" />
            <motion.div 
              initial={{ backgroundPosition: '0% 50%' }}
              animate={{ backgroundPosition: '100% 50%' }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C8102E]/5 to-transparent bg-[length:200%_100%]"
            />
          </>
        )}
      </div>

      <div className="container relative mx-auto px-4 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-[800px] space-y-4 text-center"
        >
          <h2 className={`mt-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl ${
            isDark ? "text-white" : "text-black"
          }`}>
            Frequently Asked Questions
          </h2>
          <p className={`mx-auto max-w-[600px] md:text-xl ${
            isDark ? "text-white/80" : "text-black/60"
          }`}>
            Everything you need to know about our AI-powered ordering system.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-8 max-w-[800px] space-y-6"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                borderColor: expandedIndex === index
                  ? "#C8102E"
                  : isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgb(229,231,235)",
              }}
              className={`overflow-hidden rounded-xl border-2 backdrop-blur-sm transition-all duration-200 ${
                isDark 
                  ? expandedIndex === index
                    ? 'bg-[#C8102E]/10'
                    : 'bg-black/40 hover:bg-[#C8102E]/5'
                  : 'bg-white hover:bg-red-50'
              }`}
            >
              <motion.button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-center"
              >
                <span className={`mx-auto pr-8 text-xl font-semibold ${
                  isDark ? "text-white" : "text-black"
                }`}>
                  {faq.question}
                </span>
                <motion.div
                  animate={{ 
                    rotate: expandedIndex === index ? 180 : 0,
                    color: expandedIndex === index 
                      ? "#C8102E"
                      : isDark ? "#ffffff80" : "#C8102E"
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-6"
                >
                  <ChevronDown className="h-6 w-6" />
                </motion.div>
              </motion.button>
              <AnimatePresence initial={false}>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: {
                        height: { duration: 0.3 },
                        opacity: { duration: 0.2, delay: 0.1 },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { duration: 0.3 },
                        opacity: { duration: 0.2 },
                      },
                    }}
                    className={`border-t ${
                      isDark ? "border-[#C8102E]/20" : "border-red-100"
                    }`}
                  >
                    <div className={`p-6 text-center text-lg ${
                      isDark ? "text-white/90" : "text-black/80"
                    }`}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}