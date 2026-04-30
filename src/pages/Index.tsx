import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";
import { Briefcase, GraduationCap, Lightbulb, Rocket, Users, Award } from "lucide-react";
import TimelineCard, { type TimelineItem } from "@/components/TimelineCard";
import TypingCycle from "@/components/TypingCycle";
import AnimatedStat from "@/components/AnimatedStat";
import { useCmsPage } from "@/hooks/useCmsData";

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  Lightbulb: <Lightbulb className="w-6 h-6" />,
  Rocket: <Rocket className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
};

const defaultTimelineData: TimelineItem[] = [
  { id: 1, year: "2012", title: "Undergraduate", company: "Singapore Management University", duration: "August 2012 - April 2016", description: ["School of Information Systems - technical and business studies foundation", "Skills: interaction design, prototyping, design thinking, information architecture, project management", "Undergraduate Teaching Assistant for IS306 - Interaction Design & Prototyping"], icon: <GraduationCap className="w-6 h-6" /> },
  { id: 2, year: "2016", title: "UX Student", company: "General Assembly (Singapore)", duration: "May 2016 - August 2016", description: ["Enrolled in a 10-week UX design course to get certified", "Completed five end-to-end UX Design projects", "Employed full User Experience Design process"], icon: <Lightbulb className="w-6 h-6" /> },
  { id: 3, year: "2016", title: "UX Designer (Contract)", company: "Nanyang Technological University", duration: "October 2016 - May 2017", description: ["First job in my UX career! 🎉", "Designed NTU MENTOR mobile application from user research to high fidelity prototype", "Managed the project, sourced developers, translated designs into requirements"], icon: <Rocket className="w-6 h-6" />, highlight: true },
  { id: 4, year: "2017", title: "UX Design Consultant", company: "IBM iX", duration: "July 2017 - July 2019", description: ["Consulting by Degrees graduate program", "UX design consulting for ASEAN clients across telecom, media, banking, retail, public sector", "Focus: digital transformation, app/website redesign, design systems, product conceptualization"], icon: <Briefcase className="w-6 h-6" /> },
  { id: 5, year: "2019", title: "UX Designer I (F)", company: "GovTech", duration: "August 2019 - July 2020", description: ["Joined GovTech and started OurSG Grants Portal journey", "Focused on onboarding Tote Board grants", "Started MSF grants delivery in May 2020"], icon: <Briefcase className="w-6 h-6" /> },
  { id: 6, year: "2020", title: "UX Designer II (G)", company: "GovTech", duration: "August 2020 - September 2021", description: ["Helped with TraceTogether during Covid-19 period (April 2020)", "Started NCSS grants delivery in OurSG Grants Portal"], icon: <Briefcase className="w-6 h-6" /> },
  { id: 7, year: "2021", title: "UX Designer II (H)", company: "GovTech", duration: "October 2021 - March 2023", description: ["Became Design Lead for OurSG Grants Portal", "Started AIC grants delivery"], icon: <Users className="w-6 h-6" />, highlight: true },
  { id: 8, year: "2023", title: "Senior UX Designer (I)", company: "GovTech", duration: "April 2023 - Present", description: ["Design lead for Research Grants Portal (FormFlow/BoB/ApplySG)", "Project Lead of OurSG Grants Portal since July 2024", "Design Manager for Productivity Policy Programme since April 2025", "Managing designers across Optical, GovWallet Suite, FormFlow/BoB/ApplySG, OSG"], icon: <Award className="w-6 h-6" />, highlight: true },
];

const defaultStats = [
  { value: 9, suffix: "+", label: "Years of Experience" },
  { value: 30, suffix: "+", label: "Projects Completed" },
  { value: 500, suffix: "K+", label: "Visitors Reached" },
];

const ease = [0.33, 1, 0.68, 1] as [number, number, number, number];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const TYPING_START_DELAY = 2500;

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [typingStarted, setTypingStarted] = useState(false);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  const { data: page } = useCmsPage("home");
  const content = useMemo(() => {
    if (page?.content && Object.keys(page.content as object).length > 0) {
      return page.content as any;
    }
    return null;
  }, [page]);

  const heroTitle = content?.heroTitle || "Experience...";
  const heroSubtitle = content?.heroSubtitle || "Scroll through my journey from curious student to seasoned UX professional. Every step shaped who I am today.";
  const bubbleText = content?.bubbleText || "I spent a lot of time on this!";
  const endTitle = content?.endTitle || "And the journey continues...";
  const endSubtitle = content?.endSubtitle || "Each experience has been a stepping stone, shaping my perspective on design and how it can make a real difference in people's lives.";

  const timelineData: TimelineItem[] = useMemo(() => {
    if (content?.timeline && content.timeline.length > 0) {
      return content.timeline.map((entry: any, i: number) => ({
        id: i + 1,
        year: entry.year,
        title: entry.title,
        company: entry.company,
        duration: entry.duration,
        description: entry.description || [],
        icon: iconMap[entry.icon] || <Briefcase className="w-6 h-6" />,
        highlight: entry.highlight || false,
      }));
    }
    return defaultTimelineData;
  }, [content]);

  const stats = useMemo(() => {
    if (content?.stats && content.stats.length > 0) return content.stats;
    return defaultStats;
  }, [content]);

  useEffect(() => {
    const t = setTimeout(() => setTypingStarted(true), TYPING_START_DELAY);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-20" ref={containerRef}>
      {/* Hero Section */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ y: heroParallax }}
        className="section-padding text-center max-w-5xl mx-auto"
      >
        <div className="inline-block">
          <motion.h1 variants={staggerChild} className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 font-serif">
            <span className="relative inline-block">
              <span className="overflow-hidden inline-block pb-2">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease }}
                  className="inline-block"
                >
                  {heroTitle}
                </motion.span>
              </span>
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.5, type: "spring", stiffness: 300, damping: 15 }}
                className="absolute -right-12 md:-right-[5rem] bottom-full mb-2 z-10 translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="relative bg-accent text-accent-foreground text-xs md:text-sm font-sans font-medium px-3 py-1.5 rounded-xl shadow-md whitespace-nowrap"
                >
                  {bubbleText}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-accent rotate-45" />
                </motion.div>
              </motion.div>
            </span>
            <br />
            {!typingStarted && (
              <span className="overflow-hidden inline-block">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7, ease }}
                  className="inline-block text-accent"
                >
                  DEZIGN
                </motion.span>
              </span>
            )}
            {typingStarted && <span className="whitespace-nowrap"><TypingCycle startDelay={0} /></span>}
          </motion.h1>
        </div>
        <motion.p variants={staggerChild} className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {heroSubtitle}
        </motion.p>

        <motion.div variants={staggerChild} className="mt-12 flex flex-col items-center gap-2">
          <motion.span
            className="text-sm text-muted-foreground"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            Scroll to explore
          </motion.span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-accent"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Timeline Section */}
      <section className="section-padding relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block">
          <motion.div className="w-full bg-accent origin-top" style={{ height: lineHeight }} />
        </div>
        <div className="max-w-5xl mx-auto space-y-24">
          {timelineData.map((item, index) => (
            <TimelineCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section-padding py-20">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
          {stats.map((stat: any, i: number) => (
            <AnimatedStat key={i} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </section>

      {/* End Section */}
      <motion.section
        className="section-padding text-center pb-32"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease }}
      >
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-serif">{endTitle}</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{endSubtitle}</p>
      </motion.section>
    </div>
  );
};

export default Index;
