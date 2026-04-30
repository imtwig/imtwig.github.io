import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePublicCaseStudies } from "@/hooks/useCmsData";
import { caseStudiesData } from "@/data/caseStudies";

const ease = [0.33, 1, 0.68, 1] as [number, number, number, number];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

// Static fallback
const staticCaseStudies = Object.values(caseStudiesData).map((s) => ({
  slug: s.slug,
  title: s.title,
  description: s.description,
  category: s.category,
}));

const CaseStudies = () => {
  const { data: cmsStudies } = usePublicCaseStudies();

  const studies = cmsStudies && cmsStudies.length > 0
    ? cmsStudies.map((s: any) => ({
        slug: s.slug,
        title: s.title,
        description: s.description,
        category: s.category,
        card_image: s.card_image || "",
      }))
    : staticCaseStudies.map((s) => ({ ...s, card_image: "" }));

  return (
    <div className="min-h-screen pt-16">
      <motion.div
        className="section-padding max-w-6xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="text-4xl md:text-5xl font-bold font-serif"
          >
            UX Case Studies
          </motion.h1>
        </div>
        <motion.p variants={fadeUp} className="text-muted-foreground text-lg mb-12">
          Exploring design challenges and solutions across various industries
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } } }}
          initial="hidden"
          animate="visible"
        >
          {studies.map((study) => (
            <motion.div
              key={study.slug}
              variants={fadeUp}
              whileHover={{ rotateZ: -2, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ transformPerspective: 800 }}
            >
              <Link to={`/case-studies/${study.slug}`}>
                <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {study.card_image ? (
                    <div className="h-48 overflow-hidden">
                      <img src={study.card_image} alt={study.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-48 bg-muted" />
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {study.category}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors font-serif">
                      {study.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {study.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CaseStudies;
