import { useMemo } from "react";
import { motion } from "framer-motion";
import WordCycle from "@/components/WordCycle";
import { useCmsPage } from "@/hooks/useCmsData";

const ease = [0.33, 1, 0.68, 1] as [number, number, number, number];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease } },
};

const defaultContent = {
  title: "About Me",
  subtitle: "Hello, I'm a UX Designer",
  wordCyclePrefix: "Sometimes it feels like being ",
  wordCycleWords: [
    { word: "Linguist", article: "a" },
    { word: "Engineer", article: "an" },
    { word: "Artist", article: "an" },
    { word: "Doctor", article: "a" },
    { word: "Psychologist", article: "a" },
    { word: "Economist", article: "an" },
    { word: "Statistician", article: "a" },
    { word: "Fortune-Teller", article: "a" },
    { word: "Detective", article: "a" },
    { word: "Innovator", article: "an" },
    { word: "Architect", article: "an" },
    { word: "Scientist", article: "a" },
  ],
  profileImage: "",
  paragraphs: [
    "I'm passionate about creating intuitive, user-centered digital experiences that solve real problems. With a background in design thinking and human-computer interaction, I approach each project with empathy and a commitment to understanding user needs.",
    "My design process is collaborative and iterative, combining research insights with creative problem-solving to deliver solutions that are both beautiful and functional. I believe great design is invisible—it just works.",
    "When I'm not designing, you'll find me exploring photography, which has taught me to see the world through different perspectives and appreciate the subtle details that make experiences memorable.",
  ],
  skills: ["User Research", "Wireframing", "Prototyping", "Usability Testing", "Information Architecture", "Interaction Design", "Visual Design", "Design Systems"],
  contactTitle: "Let's Connect",
  contactText: "I'm always interested in hearing about new projects and opportunities.",
  contactEmail: "hello@uxdesigner.com",
};

const About = () => {
  const { data: page } = useCmsPage("about");

  const content = useMemo(() => {
    if (page?.content && Object.keys(page.content as object).length > 0) {
      return { ...defaultContent, ...(page.content as any) };
    }
    return defaultContent;
  }, [page]);

  return (
    <div className="min-h-screen pt-16">
      <motion.div 
        className="section-padding max-w-4xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUpVariant} className="mb-8">
          {content.profileImage ? (
            <img
              src={content.profileImage}
              alt="Profile"
              className="w-full max-w-md rounded-2xl object-cover aspect-square"
            />
          ) : (
            <img
              src="/placeholder.svg"
              alt="Profile"
              className="w-full max-w-md rounded-2xl object-cover aspect-square"
            />
          )}
        </motion.div>

        <div className="overflow-hidden mb-8">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="text-4xl md:text-5xl font-bold font-serif"
          >
            {content.title}
          </motion.h1>
        </div>
        
        <div className="space-y-12">
          <motion.div variants={fadeUpVariant}>
            <h2 className="text-2xl font-semibold mb-2 font-serif">{content.subtitle}</h2>
            <p className="text-lg text-muted-foreground mb-4">
              <WordCycle prefix={content.wordCyclePrefix} words={defaultContent.wordCycleWords} />
            </p>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {content.paragraphs.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <h2 className="text-2xl font-semibold mb-6 font-serif">Skills & Expertise</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.skills.map((skill: string, index: number) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: [0, -8, 0] }}
                  transition={{
                    opacity: { duration: 0.5, delay: index * 0.1, ease },
                    y: { duration: 1.6, repeat: Infinity, delay: index * 0.2, ease: [0.42, 0, 0.58, 1] },
                  }}
                  whileHover={{ y: -12, scale: 1.05 }}
                  className="px-4 py-3 bg-muted rounded-lg text-center text-sm font-medium cursor-default"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <h2 className="text-2xl font-semibold mb-4 font-serif">{content.contactTitle}</h2>
            <p className="text-muted-foreground mb-4">{content.contactText}</p>
            <motion.a
              href={`mailto:${content.contactEmail}`}
              className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
