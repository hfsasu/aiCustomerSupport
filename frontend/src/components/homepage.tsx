"use client";
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

let titleAnimationCounter = 0;
function getNewAnimationDelay() {
  titleAnimationCounter++;
  return titleAnimationCounter * 0.15;
}

function getHeroTitleAnimation(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay }
  };
}

export function HeroSectionWithBeamsAndGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { resolvedTheme } = useTheme();
  const textColor = resolvedTheme === "dark" ? "text-white" : "text-black";
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVideoLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div
      ref={parentRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-6 md:px-8 md:py-16"
    >
      <BackgroundGrids />
      <CollisionMechanism
        beamOptions={{
          initialX: -400,
          translateX: 600,
          duration: 7,
          repeatDelay: 3,
        }}
        containerRef={containerRef}
        parentRef={parentRef}
      />
      <CollisionMechanism
        beamOptions={{
          initialX: -200,
          translateX: 800,
          duration: 4,
          repeatDelay: 3,
        }}
        containerRef={containerRef}
        parentRef={parentRef}
      />
      <CollisionMechanism
        beamOptions={{
          initialX: 200,
          translateX: 1200,
          duration: 5,
          repeatDelay: 3,
        }}
        containerRef={containerRef}
        parentRef={parentRef}
      />
      <CollisionMechanism
        containerRef={containerRef}
        parentRef={parentRef}
        beamOptions={{
          initialX: 400,
          translateX: 1400,
          duration: 6,
          repeatDelay: 3,
        }}
      />

      <header className="flex w-full flex-col items-center justify-center gap-16 py-24 text-center lg:gap-24 z-50">
        <div className="flex h-full flex-col items-center justify-center gap-8">
          <h1 className="relative px-12 text-center font-normal leading-[108px] md:text-8xl lg:text-[10xl]">
            <motion.span {...getHeroTitleAnimation(0.15)} className={textColor}>
              welcome
            </motion.span>{" "}
            <motion.span {...getHeroTitleAnimation(0.3)} className={textColor}>to</motion.span>{" "}
            <br className="hidden md:block" />
            <motion.span {...getHeroTitleAnimation(0.45)} className={textColor}>the</motion.span>{" "}
            <motion.span {...getHeroTitleAnimation(0.6)} className="italic text-red-600 dark:text-red-500">
              future
            </motion.span>{" "}
            <motion.span {...getHeroTitleAnimation(0.75)} className={textColor}>
              of fast food
            </motion.span>
          </h1>
          <motion.p 
            {...getHeroTitleAnimation(0.9)}
            className="max-w-2xl px-6 text-center text-lg text-red-600 dark:text-red-400"
          >
            Experience seamless ordering with our AI assistant. <br className="hidden sm:inline" />
            Quick, intuitive, and available 24/7.
          </motion.p>
          <motion.div {...getHeroTitleAnimation(1.05)} className="flex w-full flex-col gap-4 px-6 sm:w-auto sm:flex-row sm:gap-6">
            <Button asChild size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
              <Link href="/menu">
                View Our Menu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950">
              <Link href="/order">
                Start Ordering
              </Link>
            </Button>
          </motion.div>
        </div>
        <motion.div
          className="relative w-full px-8 lg:w-3/4 lg:px-0"
          {...getHeroTitleAnimation(1.35)}
          ref={containerRef}
        >
          <div className="rounded-[24px] border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-black">
            <div className="relative rounded-[20px] overflow-hidden">
              {isVideoLoaded ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full rounded-[20px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                    onLoadedData={() => console.log("Video loaded successfully")}
                    onError={(e) => console.error("Video error:", e)}
                  >
                    <source src="/videos/demo.webm" type="video/webm" />
                    <source src="/videos/demo.mp4" type="video/mp4" />
                  </video>
                  
                  {/* Play/Pause button overlay */}
                  <div className="absolute bottom-4 right-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-black/70 dark:hover:bg-black/90"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4 text-red-600" />
                      ) : (
                        <Play className="h-4 w-4 text-red-600" />
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-[20px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading demo...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </header>
    </div>
  );
}


const BackgroundGrids = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 grid h-full w-full -rotate-45 transform select-none grid-cols-2 gap-10 md:grid-cols-4">
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full bg-gradient-to-b from-transparent via-neutral-100 to-transparent dark:via-neutral-800">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
    </div>
  );
};

const GridLineVertical = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-neutral-200 to-transparent dark:via-neutral-700",
        className,
      )}
    />
  );
};

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement>;
    parentRef: React.RefObject<HTMLDivElement>;
    beamOptions?: {
      initialX?: number;
      translateX?: number;
      initialY?: number;
      translateY?: number;
      rotate?: number;
      duration?: number;
      delay?: number;
      repeatDelay?: number;
      className?: string;
    };
  }
>(({ containerRef, parentRef, beamOptions = {} }, ref) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({
    detected: false,
    coordinates: null,
  });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX =
            beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: {
              x: relativeX,
              y: relativeY,
            },
          });
          setCycleCollisionDetected(true);
          if (beamRef.current) {
            beamRef.current.style.opacity = "0";
          }
        }
      }
    };

    const animationInterval = setInterval(checkCollision, 50);

    return () => clearInterval(animationInterval);
  }, [cycleCollisionDetected, containerRef]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
        if (beamRef.current) {
          beamRef.current.style.opacity = "1";
        }
      }, 2000);

      setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{
          translateY: beamOptions.initialY || "-200px",
          translateX: beamOptions.initialX || "0px",
          rotate: beamOptions.rotate || -45,
        }}
        variants={{
          animate: {
            translateY: beamOptions.translateY || "800px",
            translateX: beamOptions.translateX || "700px",
            rotate: beamOptions.rotate || -45,
          },
        }}
        transition={{
          duration: beamOptions.duration || 8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0,
        }}
        className={cn(
          "absolute left-96 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-red-700 via-red-500 to-transparent",
          beamOptions.className,
        )}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            className=""
            style={{
              left: `${collision.coordinates.x + 20}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
});

CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-[4px] w-10 rounded-full bg-gradient-to-r from-transparent via-red-500 to-transparent blur-sm"
      ></motion.div>
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0,
          }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-red-700 to-red-500"
        />
      ))}
    </div>
  );
};
