import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "What is Tinkro?",
    answer:
      "Tinkro is a STEM-based learning platform that provides robotics and electronics kits designed to help students learn through hands-on projects and real-world experimentation.",
  },
  {
    question: "Who can use Tinkro kits?",
    answer:
      "Tinkro kits are ideal for school students (Class 6 and above), beginners in robotics and coding, and schools & educational institutes.",
  },
  {
    question: "Do I need prior coding knowledge?",
    answer:
      "No, Tinkro kits are beginner-friendly. Students can start without any prior experience in coding or electronics.",
  },
  {
    question: "What will students learn?",
    answer:
      "Students learn basic electronics, Arduino programming, robotics building, problem-solving, and logical thinking.",
  },
  {
    question: "Are the kits safe for kids?",
    answer:
      "Yes, all kits are designed with safety in mind and are suitable for school-level students under guidance.",
  },
  {
    question: "Can schools integrate Tinkro into their curriculum?",
    answer:
      "Yes, Tinkro solutions can be integrated into school STEM programs, labs, and workshops.",
  },
  {
    question: "Do you provide training or guidance?",
    answer:
      "Yes, Tinkro provides guidance and learning resources to help students build and understand projects step-by-step.",
  },
  {
    question: "What kind of projects can students build?",
    answer:
      "Students can build line follower robots, obstacle-avoiding robots, smart electronic systems, and basic automation projects.",
  },
  {
    question: "How is Tinkro different from other platforms?",
    answer:
      "Tinkro focuses on practical learning, DIY hands-on kits, and an easy-to-understand approach for beginners.",
  },
  {
    question: "How can I get started?",
    answer:
      "Start by selecting a kit, follow the instructions, and build your first project step-by-step.",
  },
  {
    question: "Do you offer demo sessions?",
    answer:
      "Yes, demo sessions can be arranged for schools and institutions.",
  },
  {
    question: "Are certificates provided?",
    answer:
      "Yes, students may receive certificates after completing projects or programs.",
  },
  {
    question: "Can parents track progress?",
    answer:
      "With future upgrades, dashboards and tracking systems can be integrated.",
  },
];

export function FaqPage() {
  return (
    <section className="pt-24 pb-16">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Support
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-muted-foreground mt-3">
            Quick answers about Tinkro kits, learning, and school programs.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 sm:p-6">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
