import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { Testimonial } from "../types";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div
      className="glass-card rounded-2xl p-6 space-y-4 bg-white/5 border border-white/10 h-full flex flex-col"
      data-ocid="testimonial-card"
    >
      <Quote className="w-6 h-6 text-accent/60 shrink-0" />
      <p className="text-white/80 text-sm leading-relaxed flex-1">
        "{testimonial.content}"
      </p>
      <div className="flex gap-0.5">
        {Array.from({ length: testimonial.rating }, (_, j) => (
          <Star
            key={`star-${testimonial.id}-${j}`}
            className="w-3.5 h-3.5 fill-accent text-accent"
          />
        ))}
      </div>
      <div className="flex items-center gap-3 pt-1 border-t border-white/10">
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">
            {testimonial.name[0]}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white text-sm truncate">
            {testimonial.name}
          </p>
          <p className="text-white/50 text-xs truncate">
            {testimonial.role}, {testimonial.organization}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection({ testimonials }: TestimonialsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-play every 4s
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  return (
    <section
      className="py-24 bg-[oklch(0.08_0.02_258)] relative overflow-hidden"
      id="testimonials"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl rounded-full pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <p className="text-accent font-semibold text-sm tracking-widest uppercase">
            Testimonials
          </p>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white">
            Trusted by Schools &{" "}
            <span className="gradient-text">Makers Nationwide</span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Over 500 schools and 50,000 students have taken their first step in
            robotics with Tinkro.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-smooth"
              data-ocid="testimonial-prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {scrollSnaps.map((snap, i) => (
                <button
                  key={snap}
                  type="button"
                  onClick={() => scrollTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === selectedIndex
                      ? "w-6 h-2 bg-accent"
                      : "w-2 h-2 bg-white/30 hover:bg-white/50"
                  }`}
                  data-ocid="testimonial-dot"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-smooth"
              data-ocid="testimonial-next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
