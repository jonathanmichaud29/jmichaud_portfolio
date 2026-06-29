export const SITE = {
  url: "https://www.jmichaud.ca",
  name: "Jonathan Levesque Michaud",
  title: "Full-Stack Developer",
  description: "My portfolio and blogs related to professional tips",
  defaultOgImage: "/images/og-default.png",
  social: {
    github: "https://github.com/jonathanmichaud29",
    linkedin: "https://www.linkedin.com/in/jlmichaud/",
  },
  blog: {
    pageSize: 5,
  },
} as const;

export const CV_TECHS = [
  {
    label: "Languages",
    items: ["PHP", "Python", "JavaScript", "TypeScript"],
  },
  {
    label: "Databases",
    items: ["MySQL", "PostgreSQL", "ElasticSearch"],
  },
  {
    label: "Technologies",
    items: [
      "React",
      "Node.js",
      "RESTful API",
      "Redis",
      "MaterialUI",
      "WordPress",
      "CodeIgniter",
    ],
  },
  {
    label: "Environments",
    items: [
      "Docker",
      "Kubernetes",
      "GitLab CI",
      "AWS",
      "Debian",
      "Sentry",
      "Nagios",
    ],
  },
] as const;
