import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Kamy",
  lastName: "Ewang",
  name: `Kamy Ewang`,
  role: "Software Engineer",
  avatar: "/me.jpeg",
  email: "kamy.ngn@gmail.com",
  location: "Uyo, Nigeria",
  languages: ["English"],
  locale: "en",
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/kamyCodes",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/kamyomobong-ewang-4a29822b7",
    essential: true,
  },
  {
    name: "WhatsApp",
    icon: "whatsapp",
    link: "https://wa.me/2348076730654",
    essential: false,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `Kamy Ewang – Software Engineer & AI Developer`,
  description: `Kamy Ewang is a Software Engineer based in Uyo, Nigeria, specialising in AI-powered full-stack applications, real-time platforms, and modern web development with React, Next.js, Python, and Flask.`,
  headline: <>Building AI-powered products that solve real-world problems</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Local Job Connect</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/local-job-connect",
  },
  subline: (
    <>
      I'm {person.firstName}, a {person.role.toLowerCase()} specializing in{" "}
      <Text as="span" size="xl" weight="strong">AI Integration</Text> and full-stack development. I build products that make a meaningful impact.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About Kamy Ewang – Software Engineer in Nigeria`,
  description: `Kamy Ewang is a Software Engineer from Uyo, Nigeria, building AI-powered applications, full-stack web platforms, and innovative tech solutions. Currently seeking software engineering opportunities.`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        {person.firstName} is a Uyo-based {person.role.toLowerCase()} with a passion for building software that solves real-world problems. Their work spans AI-powered applications, full-stack web platforms, and the convergence of technology and innovation.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "Freelance",
        timeframe: "2024 - Present",
        role: "Full-Stack Developer",
        achievements: [
          <>
            Built Local Job Connect, a personal project — a dual-portal job platform connecting local businesses with nearby talent, featuring AI resume parsing and real-time messaging.
          </>,
          <>
            Developed Energy2Green, a modern corporate website for a renewable energy company with responsive, professional design.
          </>,
        ],
        images: [],
      },
      {
        company: "University",
        timeframe: "2022 - 2026",
        role: "Software Engineering Student",
        achievements: [
          <>
            Completed final year project: FakeNewsCTIAnalyzer - an AI-powered system to detect and analyze fake news using Cyber Threat Intelligence.
          </>,
          <>
            Built multiple full-stack projects including Local Job Connect and Advice Generator App.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Studies",
    institutions: [
      {
        name: "University",
        description: <>Bachelor of Science in Software Engineering.</>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical skills",
    skills: [
      {
        title: "Frontend Development",
        description: (
          <>Building modern web applications with React, Next.js, and Tailwind CSS.</>
        ),
        tags: [
          {
            name: "React",
            icon: "javascript",
          },
          {
            name: "Next.js",
            icon: "nextjs",
          },
          {
            name: "Tailwind",
            icon: "javascript",
          },
        ],
        images: [],
      },
      {
        title: "Backend & AI",
        description: (
          <>Building scalable backends and integrating AI-powered features.</>
        ),
        tags: [
          {
            name: "Node.js",
            icon: "javascript",
          },
          {
            name: "Python",
            icon: "python",
          },
          {
            name: "MongoDB",
            icon: "mongodb",
          },
        ],
        images: [],
      },
      {
        title: "Version Control",
        description: (
          <>Collaborating on codebases with Git and GitHub.</>
        ),
        tags: [
          {
            name: "Git",
            icon: "github",
          },
          {
            name: "GitHub",
            icon: "github",
          },
        ],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects by Kamy Ewang – AI & Full-Stack Development`,
  description: `Explore full-stack and AI-powered projects built by Kamy Ewang, including Local Job Connect, Sentinel NLP, Energy2Green, and more.`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: [],
};

export { person, social, newsletter, home, about, blog, work, gallery };
