import type { UserProfile } from "@/types/User";

type PairingMessageAuthor = "self" | "contact";

export type PairingMessage = {
  id: string;
  author: PairingMessageAuthor;
  content: string;
  timestamp: string;
};

export type PairingContact = {
  id: string;
  profile: UserProfile;
  lastPairedAt: string;
  lastMessageAt: string;
  messages: PairingMessage[];
};

const makeUserProfile = (overrides: Partial<UserProfile>): UserProfile => ({
  organization: "Torus Labs",
  email: "",
  name: "",
  surname: "",
  accountStatus: "Active",
  pairingStatus: "Paired",
  about: "",
  hobbies: [],
  meetingActivity: "",
  interests: "",
  ...overrides,
});

export const pairingContacts: PairingContact[] = [
  {
    id: "anton-prochazka",
    profile: makeUserProfile({
      email: "anton.prochazka@toruslabs.com",
      name: "Anton",
      surname: "Prochazka",
      pairingStatus: "Paired",
      about: "Senior developer focusing on mentoring and peer reviews.",
      hobbies: ["cycling", "woodworking"],
      meetingActivity: "Weekly office coffee meetups",
      interests: "Team growth, refactoring, guitar",
    }),
    lastPairedAt: "2025-04-12T10:30:00Z",
    lastMessageAt: "2025-04-15T08:05:00Z",
    messages: [
      {
        id: "m1",
        author: "contact",
        content: "Ahoj, kedy mas cas?",
        timestamp: "2025-04-15T08:05:00Z",
      },
      {
        id: "m2",
        author: "self",
        content: "Poobede po standupe.",
        timestamp: "2025-04-15T08:06:00Z",
      },
      {
        id: "m3",
        author: "contact",
        content: "Superbraskodikyza info!",
        timestamp: "2025-04-15T08:08:00Z",
      },
    ],
  },
  {
    id: "jozef-priekopnik",
    profile: makeUserProfile({
      email: "jozef.priekopnik@toruslabs.com",
      name: "Jozef",
      surname: "Priekopnik",
      pairingStatus: "Paired",
      about: "Backend engineer diving into distributed tracing.",
      hobbies: ["running", "espresso"],
      meetingActivity: "Pair programming twice a week",
      interests: "Observability, new frameworks, travel",
    }),
    lastPairedAt: "2025-04-10T14:00:00Z",
    lastMessageAt: "2025-04-11T16:30:00Z",
    messages: [
      {
        id: "m4",
        author: "contact",
        content: "Nemas caso brasko",
        timestamp: "2025-04-11T16:28:00Z",
      },
      {
        id: "m5",
        author: "self",
        content: "Zajtra ráno pred releaseom.",
        timestamp: "2025-04-11T16:30:00Z",
      },
    ],
  },
  {
    id: "michal-mrsina",
    profile: makeUserProfile({
      email: "michal.mrsina@toruslabs.com",
      name: "Michal",
      surname: "Mrsina",
      pairingStatus: "Seeking Pair",
      about: "Product designer exploring motion prototypes.",
      hobbies: ["sketching", "bouldering"],
      meetingActivity: "Figma co-creation sessions",
      interests: "Microinteractions, inclusive design",
    }),
    lastPairedAt: "2025-03-21T09:30:00Z",
    lastMessageAt: "2025-03-30T12:10:00Z",
    messages: [
      {
        id: "m6",
        author: "contact",
        content: "Mozeme presunut workshop?",
        timestamp: "2025-03-30T12:10:00Z",
      },
    ],
  },
  {
    id: "mojmir-mojsej",
    profile: makeUserProfile({
      email: "mojmir.mojsej@toruslabs.com",
      name: "Mojmir",
      surname: "Mojsej",
      pairingStatus: "Paired",
      about: "QA analyst championing exploratory testing.",
      hobbies: ["board games", "gardening"],
      meetingActivity: "Weekly bug bash",
      interests: "Automation, empathy, story telling",
    }),
    lastPairedAt: "2025-03-28T11:45:00Z",
    lastMessageAt: "2025-03-29T08:15:00Z",
    messages: [
      {
        id: "m7",
        author: "contact",
        content: "Nemam...",
        timestamp: "2025-03-29T08:12:00Z",
      },
      {
        id: "m8",
        author: "self",
        content: "Ok, poslem update do kanala.",
        timestamp: "2025-03-29T08:15:00Z",
      },
    ],
  },
  {
    id: "andrew-babish",
    profile: makeUserProfile({
      email: "andrew.babish@toruslabs.com",
      name: "Andrew",
      surname: "Babish",
      pairingStatus: "On Hold",
      about: "Customer success lead centralizing feedback loops.",
      hobbies: ["cooking", "travel"],
      meetingActivity: "Monthly reflection sessions",
      interests: "Journey mapping, facilitation",
    }),
    lastPairedAt: "2025-03-05T10:00:00Z",
    lastMessageAt: "2025-03-12T17:20:00Z",
    messages: [
      {
        id: "m9",
        author: "contact",
        content: "Posielam update na klienta.",
        timestamp: "2025-03-12T17:20:00Z",
      },
    ],
  },
  {
    id: "peter-violet",
    profile: makeUserProfile({
      email: "peter.violet@toruslabs.com",
      name: "Peter",
      surname: "Violet",
      pairingStatus: "Paired",
      about: "DevOps engineer stabilizing release pipelines.",
      hobbies: ["photography", "snowboarding"],
      meetingActivity: "Standup walk and talk",
      interests: "Automation, observability",
    }),
    lastPairedAt: "2025-02-19T15:30:00Z",
    lastMessageAt: "2025-03-02T10:05:00Z",
    messages: [
      {
        id: "m10",
        author: "self",
        content: "Pingnem ta po deployi.",
        timestamp: "2025-03-02T10:05:00Z",
      },
    ],
  },
  {
    id: "vaclav-skocodopolevole",
    profile: makeUserProfile({
      email: "vaclav.skocodopolevole@toruslabs.com",
      name: "Vaclav",
      surname: "Skocodopolevole",
      pairingStatus: "Paired",
      about: "Data scientist mapping experimentation impact.",
      hobbies: ["ski touring", "podcasts"],
      meetingActivity: "Weekly hypothesis review",
      interests: "Experimentation, storytelling",
    }),
    lastPairedAt: "2025-01-30T09:00:00Z",
    lastMessageAt: "2025-02-02T13:45:00Z",
    messages: [
      {
        id: "m11",
        author: "contact",
        content: "Potrebujem dodane cisla do piatku.",
        timestamp: "2025-02-02T13:45:00Z",
      },
      {
        id: "m12",
        author: "self",
        content: "Mas ich v drive, folder 'experiments'.",
        timestamp: "2025-02-02T14:10:00Z",
      },
    ],
  },
];
