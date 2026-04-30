export interface CaseStudyData {
  slug: string;
  title: string;
  description: string;
  category: string;
  heroColor: string;
  tags: string[];
  timeline: {
    title: string;
    description: string;
  }[];
  bodySection: {
    eyebrow: string;
    header: string;
    body: string;
  };
  stats: {
    value: number;
    suffix: string;
    label: string;
  }[];
  reflections: string[];
}

export const caseStudiesData: Record<string, CaseStudyData> = {
  "e-commerce-redesign": {
    slug: "e-commerce-redesign",
    title: "E-Commerce Redesign",
    description:
      "A comprehensive redesign of a legacy e-commerce platform, focusing on improving conversion rates by 40% through user-centered design methodologies and iterative usability testing.",
    category: "Web Design",
    heroColor: "24 80% 55%",
    tags: ["UX Research", "Prototyping", "A/B Testing", "Figma"],
    timeline: [
      { title: "Discovery & Research", description: "Conducted stakeholder interviews, competitive analysis, and user surveys to identify pain points in the existing checkout flow." },
      { title: "User Personas & Journey Mapping", description: "Created 4 primary personas and mapped their end-to-end journeys to uncover friction points and opportunities." },
      { title: "Wireframing & Ideation", description: "Produced low-fidelity wireframes exploring 3 distinct layout approaches for the product detail and cart pages." },
      { title: "Usability Testing Round 1", description: "Ran moderated usability tests with 12 participants, identifying 8 critical usability issues in the checkout flow." },
      { title: "High-Fidelity Prototyping", description: "Built interactive prototypes in Figma incorporating feedback, refined visual design with the brand team." },
      { title: "Launch & Iteration", description: "Rolled out the redesign in phases, monitored analytics, and iterated based on live user behavior data." },
    ],
    bodySection: {
      eyebrow: "Design Approach",
      header: "Simplifying the Purchase Journey",
      body: "The core challenge was reducing cognitive load during checkout. We stripped away unnecessary form fields, introduced a progress indicator, and redesigned the cart summary to surface key information at a glance. By consolidating the checkout into a 3-step flow (from the original 7), we saw a measurable reduction in cart abandonment within the first two weeks of launch.",
    },
    stats: [
      { value: 40, suffix: "%", label: "Increase in Conversion" },
      { value: 65, suffix: "%", label: "Reduction in Cart Abandonment" },
      { value: 12, suffix: "", label: "Usability Tests Conducted" },
      { value: 4.8, suffix: "/5", label: "Average User Satisfaction" },
    ],
    reflections: [
      "Learned that early and frequent testing with real users saves more time than polishing pixel-perfect mocks.",
      "Discovered the importance of aligning stakeholder expectations through shared design principles before diving into wireframes.",
      "Recognized that small micro-interactions (like a subtle cart animation) can have outsized impact on perceived quality.",
    ],
  },
  "healthcare-mobile-app": {
    slug: "healthcare-mobile-app",
    title: "Healthcare Mobile App",
    description:
      "Designed an accessible mobile application for patients to manage appointments, view medical records, and communicate with healthcare providers seamlessly.",
    category: "Mobile App",
    heroColor: "170 60% 45%",
    tags: ["Mobile Design", "Accessibility", "User Research", "React Native"],
    timeline: [
      { title: "Stakeholder Alignment", description: "Facilitated workshops with clinicians, administrators, and patients to define the product vision and core feature set." },
      { title: "Accessibility Audit", description: "Reviewed WCAG 2.1 AA guidelines and conducted an audit of competing health apps to establish accessibility benchmarks." },
      { title: "Information Architecture", description: "Designed a clear navigation structure balancing patient-facing features with provider communication tools." },
      { title: "Prototype & Test", description: "Built clickable prototypes and tested with 15 patients across diverse demographics and accessibility needs." },
      { title: "Visual Design System", description: "Created a component library with high-contrast color tokens, scalable typography, and touch-friendly targets." },
      { title: "Handoff & QA", description: "Delivered annotated specs to engineering and participated in QA to ensure design fidelity across devices." },
    ],
    bodySection: {
      eyebrow: "Core Philosophy",
      header: "Accessibility as a First-Class Citizen",
      body: "Healthcare apps serve a diverse population—many of whom have visual, motor, or cognitive challenges. We embedded accessibility from day one: large tap targets, voice-over compatible navigation, high-contrast modes, and plain-language copy. The result was an app that scored 96/100 on accessibility audits and received praise from patient advocacy groups.",
    },
    stats: [
      { value: 96, suffix: "/100", label: "Accessibility Score" },
      { value: 15, suffix: "", label: "Patient Interviews" },
      { value: 3, suffix: "x", label: "Faster Appointment Booking" },
      { value: 92, suffix: "%", label: "Patient Satisfaction" },
    ],
    reflections: [
      "Accessibility isn't a feature to bolt on—it's a design philosophy that must be present from the first sketch.",
      "Working directly with patients revealed needs no amount of desk research could have uncovered.",
      "A well-structured design system dramatically accelerated handoff and reduced engineering back-and-forth.",
    ],
  },
  "saas-dashboard": {
    slug: "saas-dashboard",
    title: "SaaS Dashboard",
    description:
      "Redesigned a complex analytics dashboard to help product managers quickly surface actionable insights from large datasets without feeling overwhelmed.",
    category: "Dashboard",
    heroColor: "250 55% 55%",
    tags: ["Data Visualization", "Dashboard Design", "Design System", "D3.js"],
    timeline: [
      { title: "Data Inventory", description: "Catalogued 200+ data points and worked with PMs to prioritize which metrics truly drive decisions." },
      { title: "Card Sorting & IA", description: "Ran card sorting exercises with 10 users to determine logical groupings and hierarchy of information." },
      { title: "Dashboard Wireframes", description: "Explored 5 layout concepts ranging from dense data tables to visual-first chart layouts." },
      { title: "Interactive Prototypes", description: "Built functional prototypes with real data using D3.js to validate chart readability and interaction patterns." },
      { title: "Design System Expansion", description: "Extended the existing design system with chart components, data table variants, and filter patterns." },
      { title: "Beta Launch & Feedback", description: "Released to 50 beta users, collected NPS and qualitative feedback, and iterated on the top 5 pain points." },
    ],
    bodySection: {
      eyebrow: "Data Storytelling",
      header: "From Data Overload to Actionable Clarity",
      body: "The original dashboard presented every metric with equal visual weight, leaving users overwhelmed. We introduced a progressive disclosure model: a high-level summary view with drill-down capabilities. Key metrics were elevated into 'insight cards' with contextual annotations, while secondary data lived in expandable panels. Users reported finding insights 60% faster in comparative testing.",
    },
    stats: [
      { value: 60, suffix: "%", label: "Faster Insight Discovery" },
      { value: 200, suffix: "+", label: "Data Points Organized" },
      { value: 50, suffix: "", label: "Beta Users Tested" },
      { value: 72, suffix: "", label: "NPS Score Achieved" },
    ],
    reflections: [
      "Progressive disclosure is the most powerful pattern for complex dashboards—show less to communicate more.",
      "Real data in prototypes catches design issues that placeholder content never will.",
      "Close collaboration with data engineers early on prevented many downstream implementation surprises.",
    ],
  },
};
