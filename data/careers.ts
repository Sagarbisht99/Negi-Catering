/** Open roles shown on the careers page and stored with every application. */
export const careerRoles = ["Helper", "Cook", "Chef"] as const;
export type CareerRole = (typeof careerRoles)[number];

/** Review states for a job application in the admin panel. */
export const applicationStatuses = [
  "pending",
  "shortlisted",
  "rejected",
] as const;
export type ApplicationStatus = (typeof applicationStatuses)[number];

export type CareerRoleDetail = {
  role: CareerRole;
  blurb: string;
  type: string;
  image: string;
};

export const careerRoleDetails: CareerRoleDetail[] = [
  {
    role: "Helper",
    blurb:
      "Assist the kitchen and service team — prep, packing, and on-site setup for events and tiffin routes.",
    type: "Full-time / Part-time",
    image:
      "https://i.pinimg.com/1200x/0c/28/4d/0c284d922585e9e3e651012f817b6188.jpg",
  },
  {
    role: "Cook",
    blurb:
      "Cook fresh home-style North Indian food in bulk, keeping taste and hygiene consistent every day.",
    type: "Full-time",
    image:
      "https://i.pinimg.com/736x/ea/f4/3d/eaf43d3f15dbac7429d749462dfd6ddf.jpg",
  },
  {
    role: "Chef",
    blurb:
      "Handle event catering — menu coordination, buffet presentation, and guest-facing service.",
    type: "Full-time / Event-based",
    image:
      "https://i.pinimg.com/1200x/15/10/2d/15102df0f71c63f965cf4510aa38f675.jpg",
  },
];

/** Resume / document upload limits — shared by the form and the server action. */
export const RESUME_MAX_BYTES = 5_000_000;
export const RESUME_ACCEPT = ".pdf,.doc,.docx";
export const RESUME_EXTENSIONS = ["pdf", "doc", "docx"];
