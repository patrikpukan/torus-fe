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
  pairedAt: string;
  lastMessageAt: string;
  messages: PairingMessage[];
  pairingId?: string;
  pairingStatus?: string;
  isCurrentlyMatched?: boolean;
};

const makeUserProfile = (overrides: Partial<UserProfile>): UserProfile => ({
  organization: "Torus Labs",
  email: "",
  firstName: "",
  lastName: "",
  accountStatus: "Active",
  pairingStatus: "Paired",
  about: "",
  hobbies: null,
  interests: null,
  ...overrides,
});

export const pairingContacts: PairingContact[] = [
  {
    id: "anton-prochazka",
    profile: makeUserProfile({
      email: "anton.prochazka@toruslabs.com",
      firstName: "Anton",
      lastName: "Prochazka",
      pairingStatus: "Paired",
      about: "Senior developer focusing on mentoring and peer reviews.",
      hobbies: [
        { id: "h1", name: "cycling", category: "HOBBY" },
        { id: "h2", name: "woodworking", category: "HOBBY" },
      ],
      interests: [
        { id: "i1", name: "Team growth", category: "INTEREST" },
        { id: "i2", name: "refactoring", category: "INTEREST" },
        { id: "i3", name: "guitar", category: "INTEREST" },
      ],
    }),
    pairedAt: "2025-04-12T10:30:00Z",
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
      firstName: "Jozef",
      lastName: "Priekopnik",
      pairingStatus: "Paired",
      about: "Backend engineer diving into distributed tracing.",
      hobbies: [
        { id: "h3", name: "running", category: "HOBBY" },
        { id: "h4", name: "espresso", category: "HOBBY" },
      ],
      interests: [
        { id: "i4", name: "Observability", category: "INTEREST" },
        { id: "i5", name: "new frameworks", category: "INTEREST" },
        { id: "i6", name: "travel", category: "INTEREST" },
      ],
    }),
    pairedAt: "2025-04-10T14:00:00Z",
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
      firstName: "Michal",
      lastName: "Mrsina",
      pairingStatus: "Seeking Pair",
      about: "Product designer exploring motion prototypes.",
      hobbies: [
        { id: "h5", name: "sketching", category: "HOBBY" },
        { id: "h6", name: "bouldering", category: "HOBBY" },
      ],
      interests: [
        { id: "i7", name: "Microinteractions", category: "INTEREST" },
        { id: "i8", name: "inclusive design", category: "INTEREST" },
      ],
    }),
    pairedAt: "2025-03-21T09:30:00Z",
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
      firstName: "Mojmir",
      lastName: "Mojsej",
      pairingStatus: "Paired",
      about: "QA analyst championing exploratory testing.",
      hobbies: [
        { id: "h7", name: "board games", category: "HOBBY" },
        { id: "h8", name: "gardening", category: "HOBBY" },
      ],
      interests: [
        { id: "i9", name: "Automation", category: "INTEREST" },
        { id: "i10", name: "empathy", category: "INTEREST" },
        { id: "i11", name: "story telling", category: "INTEREST" },
      ],
    }),
    pairedAt: "2025-03-28T11:45:00Z",
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
      firstName: "Andrew",
      lastName: "Babish",
      pairingStatus: "On Hold",
      about: "Customer success lead centralizing feedback loops.",
      hobbies: [
        { id: "h9", name: "cooking", category: "HOBBY" },
        { id: "h10", name: "travel", category: "HOBBY" },
      ],
      interests: [
        { id: "i12", name: "Journey mapping", category: "INTEREST" },
        { id: "i13", name: "facilitation", category: "INTEREST" },
      ],
    }),
    pairedAt: "2025-03-05T10:00:00Z",
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
      firstName: "Peter",
      lastName: "Violet",
      pairingStatus: "Paired",
      about: "DevOps engineer stabilizing release pipelines.",
      hobbies: [
        { id: "h11", name: "photography", category: "HOBBY" },
        { id: "h12", name: "snowboarding", category: "HOBBY" },
      ],
      interests: [
        { id: "i14", name: "Automation", category: "INTEREST" },
        { id: "i15", name: "observability", category: "INTEREST" },
      ],
    }),
    pairedAt: "2025-02-19T15:30:00Z",
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
      firstName: "Vaclav",
      lastName: "Skocodopolevole",
      pairingStatus: "Paired",
      about: "Data scientist mapping experimentation impact.",
      hobbies: [
        { id: "h13", name: "ski touring", category: "HOBBY" },
        { id: "h14", name: "podcasts", category: "HOBBY" },
      ],
      interests: [
        { id: "i16", name: "Experimentation", category: "INTEREST" },
        { id: "i17", name: "storytelling", category: "INTEREST" },
      ],
    }),
    pairedAt: "2025-01-30T09:00:00Z",
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
