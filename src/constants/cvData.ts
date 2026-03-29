export const CV_DATA = {
  name: "Nadhem Jbeli",
  title: "Backend Engineer · Full-Stack JavaScript",
  subtitle: "Backend Engineer // Node.js // GCP",
  email: "naadhem.jbeli@gmail.com",
  phone: "+216 27 669 842",
  location: "Nabeul, TN",
  linkedin: "linkedin.com/in/nadhemjbeli",
  github: "github.com/nadhemjbeli",
  
  profile: "Backend engineer specialized in building AI-powered SaaS and mission-critical APIs. Expertise in NestJS microservices, automated data pipelines, and cloud-native application logic on GCP.",
  
  skills: {
    languages: ["TypeScript", "JavaScript", "Python"],
    backend: ["Node.js", "NestJS", "FastAPI", "React"],
    architecture: ["Microservices", "Data Pipelines", "SOLID Principles"],
    databases: ["PostgreSQL", "MongoDB", "Redis"],
    devops: ["Docker", "GCP (Cloud Run, GCS)", "Linux"],
    testing: ["Jest", "Unit & Integration Testing"]
  },
  
  experience: [
    {
      role: "Backend Engineer",
      company: "Euklydia",
      period: "June 2024 -- Present",
      location: "Tunis, TN",
      highlights: [
        "Architecting core NestJS backend for DeepSocial (AI social media intelligence)",
        "Automated multi-platform social data ingestion flows",
        "Integrated Python/FastAPI emotion-detection microservices",
        "Optimized SQL performance, improving dashboard latency by ~40%",
        "Driving system reliability with 95%+ unit test coverage"
      ]
    },
    {
      role: "Full-Stack JavaScript Intern",
      company: "Euklydia",
      period: "Jan 2024 -- June 2024",
      highlights: [
        "Developed features for DeepSocial prototype using React & Node.js",
        "Established initial testing baseline with Jest",
        "Authored technical documentation for service integrations"
      ]
    }
  ],
  
  projects: [
    {
      name: "DeepSocial",
      description: "AI-powered social media intelligence SaaS.",
      link: "https://deepsocial.fr",
      status: "ACTIVE",
      load: "78%"
    },
    {
      name: "Euklydia CMS",
      description: "AI marketing agency website and internal tools.",
      link: "https://euklydia.com",
      status: "STABLE",
      load: "12%"
    }
  ],
  
  archives: [
    {
      id: "EVIDENCE_#001",
      title: "DeepSocial Core Architecture",
      operation: "OPERATION: AI_INTEL_INGESTION",
      date: "2024.08.15",
      status: "MISSION_COMPLETE",
      tech: ["NestJS", "Redis", "GCP", "FastAPI"],
      description: "Scalable ingestion engine for multi-platform social data.",
      links: {
        live: "https://deepsocial.fr",
        source: null
      }
    },
    {
      id: "EVIDENCE_#002",
      title: "Emotion Detection Service",
      operation: "OPERATION: NLP_SIGNAL_ANALYSIS",
      date: "2024.05.20",
      status: "DEPLOYED_GLOBALLY",
      tech: ["Python", "FastAPI", "NLP", "GCP"],
      description: "Microservice for real-time sentiment and emotion extraction from social posts.",
      links: {
        live: null,
        source: "https://github.com/nadhemjbeli"
      }
    },
    {
      id: "EVIDENCE_#003",
      title: "Task Orchestration Engine",
      operation: "OPERATION: ASYNC_PIPELINE_ORCHESTRATOR",
      date: "2024.02.10",
      status: "MISSION_COMPLETE",
      tech: ["Node.js", "BullMQ", "PostgreSQL"],
      description: "Robust queuing system for processing large-scale social media data streams.",
      links: {
        live: null,
        source: null
      }
    }
  ],
  
  education: [
    {
      degree: "Software Engineering (B.Eng.)",
      school: "ESPRIT",
      period: "2021 -- 2024"
    },
    {
      degree: "Computer Science (DUT)",
      school: "ISET Nabeul",
      period: "2019 -- 2021"
    }
  ],
  
  certifications: [
    {
      name: "GCP Fundamentals",
      issuer: "Google",
      year: "2026"
    }
  ]
};
