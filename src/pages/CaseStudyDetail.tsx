import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AnimatedStat from "@/components/AnimatedStat";
import { caseStudiesData } from "@/data/caseStudies";
import { usePublicCaseStudy, usePublicCaseStudies } from "@/hooks/useCmsData";

const ease = [0.42, 0, 0.58, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
};

const FloatingImage = ({ width, height, delay, className, src }: { width: number; height: number; delay: number; className?: string; src?: string }) => (
  <motion.div
    className={`rounded-2xl bg-muted border border-border shadow-lg overflow-hidden ${className}`}
    style={{ width, height }}
    animate={{ y: [0, -14, 0] }}
    transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
  >
    {src ? (
      <img src={src} alt="" className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-xs">{width}×{height}</div>
    )}
  </motion.div>
);

const BobbingImage = ({ size, delay, offsetX, offsetY, rotate, src }: { size: number; delay: number; offsetX: string; offsetY: string; rotate: number; src?: string }) => (
  <motion.div
    className="absolute rounded-2xl bg-muted border border-border shadow-md overflow-hidden"
    style={{ width: size, height: size * 0.75, left: offsetX, top: offsetY, rotate }}
    animate={{ y: [0, -8, 0], rotate: [rotate, rotate + 2, rotate] }}
    transition={{ duration: 6 + delay * 2, repeat: Infinity, ease: "easeInOut", delay }}
  >
    {src ? (
      <img src={src} alt="" className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-xs rounded-2xl">IMG</div>
    )}
  </motion.div>
);

const CaseStudyDetail = () => {
  const { slug } = useParams();
  const { data: cmsData, isLoading } = usePublicCaseStudy(slug);
  const { data: allStudies } = usePublicCaseStudies();

  const study = useMemo(() => {
    if (isLoading) return null;
    if (!cmsData) return caseStudiesData[slug || ""] || null;
    if (cmsData.source === "static") return cmsData.staticData;

    const s = cmsData.study!;
    const sections = cmsData.sections;

    return {
      slug: s.slug,
      title: s.title,
      description: s.description,
      category: s.category,
      heroColor: s.hero_color,
      tags: s.tags || [],
      heroImages: (s as any).hero_images || [],
      sections,
    };
  }, [cmsData, isLoading, slug]);

  const { prevStudy, nextStudy } = useMemo(() => {
    const studyList = allStudies && allStudies.length > 0
      ? allStudies.map((s: any) => ({ slug: s.slug, title: s.title }))
      : Object.values(caseStudiesData).map((s) => ({ slug: s.slug, title: s.title }));
    const idx = studyList.findIndex((s) => s.slug === slug);
    return {
      prevStudy: idx > 0 ? studyList[idx - 1] : undefined,
      nextStudy: idx < studyList.length - 1 ? studyList[idx + 1] : undefined,
    };
  }, [slug, allStudies]);

  const heroImages: string[] = (study as any)?.heroImages || [];

  if (isLoading) return <div className="min-h-screen pt-16 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!study) return <div className="min-h-screen pt-16 flex items-center justify-center"><p className="text-muted-foreground text-lg">Case study not found.</p></div>;

  const renderSections = () => {
    if (cmsData?.source === "cms" && cmsData.sections.length > 0) {
      return cmsData.sections.map((section) => {
        switch (section.section_type) {
          case "timeline":
            return <TimelineSection key={section.id} items={section.content?.items || []} tags={(study as any).tags} />;
          case "body_text":
            return <BodyTextSection key={section.id} content={section.content} />;
          case "stats":
            return <StatsSection key={section.id} items={section.content?.items || []} />;
          case "reflections":
            return <ReflectionsSection key={section.id} content={section.content} />;
          default:
            return null;
        }
      });
    }

    const s = study as any;
    return (
      <>
        {s.timeline?.length > 0 && <TimelineSection items={s.timeline} tags={s.tags} />}
        <BodyTextSection content={s.bodySection} />
        {s.stats?.length > 0 && <StatsSection items={s.stats} />}
        {s.reflections?.length > 0 && <ReflectionsSection content={{ items: s.reflections, images: [] }} />}
      </>
    );
  };

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative pt-24 pb-20 overflow-hidden" style={{ backgroundColor: `hsl(${(study as any).heroColor})` }}>
        <div className="section-padding max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <motion.div className="flex-1 z-10" initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeUp}>
              <Link to="/case-studies" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-6 text-sm">
                <ArrowLeft className="w-4 h-4" /> Back to Case Studies
              </Link>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Badge className="uppercase tracking-widest text-[10px] font-bold bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 mb-4">{(study as any).category}</Badge>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-primary-foreground leading-tight mb-4">{(study as any).title}</motion.h1>
            <motion.p variants={fadeUp} className="text-primary-foreground/80 text-lg max-w-lg mb-6">{(study as any).description}</motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {((study as any).tags || []).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-primary-foreground border-primary-foreground/40 text-xs">{tag}</Badge>
              ))}
            </motion.div>
          </motion.div>
          <div className="flex-1 relative h-[340px] hidden md:block">
            <FloatingImage width={220} height={160} delay={0} className="absolute top-0 left-4" src={heroImages[0]} />
            <FloatingImage width={180} height={220} delay={0.8} className="absolute top-8 right-0" src={heroImages[1]} />
            <FloatingImage width={160} height={120} delay={1.6} className="absolute bottom-0 left-1/4" src={heroImages[2]} />
          </div>
        </div>
      </section>

      {renderSections()}

      {/* PREV / NEXT */}
      <section className="section-padding max-w-5xl mx-auto pb-20">
        <div className="flex justify-between items-center border-t border-border pt-10">
          {prevStudy ? (
            <Link to={`/case-studies/${prevStudy.slug}`} className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <div>
                <span className="text-xs uppercase tracking-wide">Previous</span>
                <p className="font-serif font-semibold text-foreground">{prevStudy.title}</p>
              </div>
            </Link>
          ) : <div />}
          {nextStudy ? (
            <Link to={`/case-studies/${nextStudy.slug}`} className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-right">
              <div>
                <span className="text-xs uppercase tracking-wide">Next</span>
                <p className="font-serif font-semibold text-foreground">{nextStudy.title}</p>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : <div />}
        </div>
      </section>
    </div>
  );
};

// ─── Section Components ───

const TimelineSection = ({ items, tags }: { items: any[]; tags: string[] }) => (
  <section className="section-padding max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row gap-16">
      <motion.div className="md:w-2/5" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
        <motion.div variants={fadeUp}><Badge className="uppercase tracking-widest text-[10px] font-bold mb-4">Process</Badge></motion.div>
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold font-serif mb-4">Design Timeline</motion.h2>
        <motion.p variants={fadeUp} className="text-muted-foreground mb-4">A step-by-step look at how this project evolved from research to launch.</motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
          {(tags || []).slice(0, 3).map((tag: string) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
        </motion.div>
      </motion.div>
      <div className="md:w-3/5 relative">
        <div className="absolute left-4 md:left-5 top-0 bottom-0 w-px bg-border" />
        {items.map((item, i) => (
          <motion.div key={i} className="relative pl-12 md:pl-14 pb-10 last:pb-0" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12, ease }}>
            <div className="absolute left-2 md:left-3 top-1 w-5 h-5 rounded-full bg-accent border-2 border-background" />
            <h4 className="font-semibold text-foreground font-serif text-lg">{item.title}</h4>
            <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const BodyTextSection = ({ content }: { content: any }) => (
  <section className="section-padding max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row gap-12 items-center">
      <motion.div className="md:w-1/2" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
        <motion.div variants={fadeUp}><Badge className="uppercase tracking-widest text-[10px] font-bold mb-4">{content?.eyebrow}</Badge></motion.div>
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold font-serif mb-4">{content?.header}</motion.h2>
        <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed">{content?.body}</motion.p>
      </motion.div>
      <motion.div className="md:w-1/2" initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
        {content?.image ? (
          <img src={content.image} alt={content?.header || "Section image"} className="w-full aspect-[4/3] rounded-2xl object-cover" />
        ) : (
          <div className="w-full aspect-[4/3] rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground/40">Placeholder Image</div>
        )}
      </motion.div>
    </div>
  </section>
);

const StatsSection = ({ items }: { items: any[] }) => (
  <section className="section-padding py-20 max-w-5xl mx-auto">
    <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
      <Badge className="uppercase tracking-widest text-[10px] font-bold mb-4">Impact</Badge>
      <h2 className="text-3xl md:text-4xl font-bold font-serif">By the Numbers</h2>
    </motion.div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {items.map((stat, i) => (
        <AnimatedStat key={i} value={stat.value} suffix={stat.suffix} label={stat.label} duration={2 + i * 0.3} />
      ))}
    </div>
  </section>
);

const ReflectionsSection = ({ content }: { content: any }) => {
  const items: string[] = content?.items || [];
  const images: string[] = content?.images || [];

  return (
    <section className="section-padding max-w-6xl mx-auto">
      <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <Badge className="uppercase tracking-widest text-[10px] font-bold mb-4">Takeaways</Badge>
        <h2 className="text-3xl md:text-4xl font-bold font-serif">Reflections</h2>
      </motion.div>
      <div className="relative h-[260px] mx-auto max-w-xl mb-16">
        <BobbingImage size={200} delay={0} offsetX="5%" offsetY="10%" rotate={-4} src={images[0]} />
        <BobbingImage size={180} delay={1.2} offsetX="35%" offsetY="5%" rotate={3} src={images[1]} />
        <BobbingImage size={160} delay={0.6} offsetX="60%" offsetY="18%" rotate={-2} src={images[2]} />
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } } }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {items.map((text, i) => (
          <motion.div key={i} variants={fadeUp} whileHover={{ rotateZ: -2, scale: 1.03 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} style={{ transformPerspective: 800 }} className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow cursor-default">
            <span className="text-accent font-bold text-lg font-serif">{String(i + 1).padStart(2, "0")}</span>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{text}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CaseStudyDetail;
