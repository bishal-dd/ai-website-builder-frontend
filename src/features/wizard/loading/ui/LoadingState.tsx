"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { LoadingStateProps, loadingSteps } from "../types/steps";
import gsap from "gsap";

export function LoadingState({ isOpen, backendProgress }: LoadingStateProps) {
  const steps = loadingSteps;
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentThought, setCurrentThought] = useState<{
    [key: number]: number;
  }>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const thoughtRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= backendProgress) return prev;
        return prev + 1;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [backendProgress, isOpen]);

  useEffect(() => {
    const stepIndex = Math.min(Math.floor(progress / 25), steps.length - 1);
    setCurrentStep(stepIndex);
  }, [progress, steps.length]);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      gsap.set(containerRef.current, { opacity: 0 });
      tl.to(containerRef.current, {
        opacity: 1,
        duration: 0.3,
      });

      gsap.set(cardRef.current, { scale: 0.8, opacity: 0, y: 30 });
      tl.to(
        cardRef.current,
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.1"
      );

      gsap.set(spinnerRef.current, { scale: 0, rotation: -180 });
      tl.to(
        spinnerRef.current,
        {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(1.4)",
        },
        "-=0.3"
      );

      gsap.set(iconRef.current, { scale: 0 });
      tl.to(
        iconRef.current,
        {
          scale: 1,
          duration: 0.4,
          ease: "elastic.out(1, 0.6)",
        },
        "-=0.2"
      );

      gsap.set([titleRef.current, descRef.current], { opacity: 0, y: 20 });
      tl.to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        "-=0.2"
      );
      tl.to(
        descRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        "-=0.3"
      );

      const stepElements = stepsContainerRef.current?.children;
      if (stepElements) {
        gsap.set(stepElements, { opacity: 0, x: -30 });
        tl.to(
          stepElements,
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.2"
        );
      }
    });

    return () => ctx.revert();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !spinnerRef.current) return;

    const rotation = gsap.to(spinnerRef.current, {
      rotation: 360,
      duration: 2,
      ease: "none",
      repeat: -1,
    });

    return () => {
      rotation.kill();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !iconRef.current) return;

    const pulse = gsap.to(iconRef.current, {
      scale: 1.2,
      duration: 0.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      pulse.kill();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !particlesRef.current) return;

    const particles = particlesRef.current.children;
    const ctx = gsap.context(() => {
      Array.from(particles).forEach((particle, index) => {
        gsap.to(particle, {
          y: `random(-100, -200)`,
          x: `random(-50, 50)`,
          opacity: 0,
          scale: `random(0.5, 1.5)`,
          duration: `random(2, 4)`,
          delay: index * 0.3,
          ease: "power1.out",
          repeat: -1,
          repeatDelay: 0.5,
        });
      });
    });

    return () => ctx.revert();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !stepsContainerRef.current) return;

    const stepElements = Array.from(stepsContainerRef.current.children);
    const currentStepElement = stepElements[currentStep];

    if (currentStepElement) {
      gsap.to(currentStepElement, {
        scale: 1.05,
        duration: 0.3,
        ease: "back.out(1.5)",
      });

      const icon = currentStepElement.querySelector(".step-icon");
      if (icon) {
        gsap.fromTo(
          icon,
          { rotation: -10 },
          {
            rotation: 10,
            duration: 0.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 3,
          }
        );
      }

      const thoughtElement = thoughtRefs.current[currentStep];
      if (thoughtElement) {
        gsap.fromTo(
          thoughtElement,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
          }
        );
      }

      stepElements.forEach((el, idx) => {
        if (idx !== currentStep) {
          gsap.to(el, {
            scale: 1,
            duration: 0.3,
          });
        }
      });
    }
  }, [currentStep, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentThought((prev) => {
        const thoughts = steps[currentStep]?.thoughts || [];
        const currentIndex = prev[currentStep] || 0;
        const nextIndex = (currentIndex + 1) % thoughts.length;

        return {
          ...prev,
          [currentStep]: nextIndex,
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [currentStep, isOpen, steps]);

  useEffect(() => {
    if (!isOpen) return;

    const thoughtElement = thoughtRefs.current[currentStep];
    if (thoughtElement) {
      gsap.fromTo(
        thoughtElement,
        { opacity: 0, y: 10, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.5)",
        }
      );
    }
  }, [currentThought, currentStep, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div
        ref={particlesRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${50 + Math.random() * 50}%`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md mx-4">
        <div
          ref={cardRef}
          className="bg-card border rounded-2xl shadow-2xl p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />

          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-primary/10" />

                <div
                  ref={spinnerRef}
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/50"
                />

                <div className="absolute inset-2 rounded-full border-2 border-accent/20" />

                <div
                  ref={iconRef}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
              </div>
            </div>

            <h2
              ref={titleRef}
              className="text-2xl font-bold text-center mb-2 text-balance"
            >
              Generating Your Website
            </h2>
            <p
              ref={descRef}
              className="text-sm text-muted-foreground text-center mb-8 text-balance"
            >
              Hold tight while we craft something extraordinary
            </p>

            <div ref={stepsContainerRef} className="space-y-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const thoughtIndex = currentThought[index] || 0;
                const currentThoughtText = step.thoughts[thoughtIndex];

                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-4 rounded-xl transition-all duration-500 ${
                      isActive
                        ? "bg-primary/10 shadow-lg"
                        : isCompleted
                        ? "opacity-50"
                        : "opacity-30"
                    }`}
                  >
                    <div
                      className={`step-icon flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shrink-0 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : isCompleted
                          ? "bg-primary/50 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-sm font-medium block ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.text}
                      </span>
                      {isActive && (
                        <div className="mt-2 space-y-1">
                          <div
                            ref={(el) => {
                              thoughtRefs.current[index] = el;
                            }}
                            className="text-xs text-black/80 italic font-light"
                          >
                            {currentThoughtText}
                          </div>
                          <div className="flex gap-1">
                            <span
                              className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <span
                              className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <span
                              className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {isCompleted && (
                      <div className="text-primary shrink-0">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-center">
              <span className="text-xs font-mono text-muted-foreground">
                {progress}% complete
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
