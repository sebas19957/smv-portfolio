import type { BrandIconRef } from '../shared/ui/brand-icons';
import type { TechChip, TechId } from './content/tech';
import type { Locale } from './locales';

/**
 * Typed content model. Localized copy lives in `content/<locale>.ts`, language-neutral facts
 * (URLs, levels, tech names, media keys) live in `content/profile.ts`.
 */

/** Inline rich text: plain runs plus at most one accent run per headline. */
export type RichText = ReadonlyArray<string | { readonly accent: string }>;

export type SectionId = 'home' | 'about' | 'skills' | 'resume' | 'projects' | 'testimonials' | 'contact';

export type AccentKey =
  | 'blue'
  | 'vermilion'
  | 'violet'
  | 'amber'
  | 'teal'
  | 'magenta'
  | 'lime'
  | 'mint'
  | 'indigo'
  | 'cyan'
  | 'orange'
  | 'sky'
  | 'green';

export type SocialId = 'facebook' | 'instagram' | 'linkedin' | 'github' | 'email';

export type SkillCategory = 'frontend' | 'backend' | 'mobile' | 'devops' | 'cloud' | 'tools' | 'ai';

export type ProjectCategory = 'work' | 'personal';

/** Detail-view template of a project. */
export type ProjectKind = 'web' | 'mobile' | 'backend';

/** Which part of a product an entry documents (front and back are separate entries). */
export type ProjectPart = 'frontend' | 'backend' | 'workers' | 'mobile' | 'fullstack';

export type StackGroup = 'languages' | 'frameworks' | 'libraries' | 'databases' | 'ai' | 'infrastructure' | 'testing';

/** Co-authored projects: a pair or a larger team. */
export type ProjectTeam = 'pair' | 'group';

export type EducationCategory = 'systems' | 'health' | 'diploma';

export type ImageKey = 'me' | 'profileAbout';

/* ---------- Language-neutral profile data ---------- */

export interface SocialLink {
  readonly id: SocialId;
  readonly label: string;
  readonly href: string;
  /** Official network logo (envelope pictogram for email). */
  readonly icon: BrandIconRef;
}

export interface SkillFact {
  /** Product names stay as-is; generic practices may be localized per language. */
  readonly name: string | Readonly<Record<'en' | 'es', string>>;
  readonly level: number;
  readonly category: SkillCategory;
  /** Official mark of the skill (or a pictogram when none exists), resolved at build time. */
  readonly icon: BrandIconRef;
}

/**
 * A stack item: a registry id, an id with a custom label (e.g. a version), or a plain label for
 * a library without an official mark (rendered as a chip without logo).
 */
export type TechRef = TechId | { readonly tech?: TechId; readonly label: string };

export interface ProjectText {
  /** Title split so the trailing part takes the project colour ("Web " + "Remember"). */
  readonly title: { readonly base: string; readonly accent: string };
  /** One or two lines for the card. */
  readonly summary: string;
  readonly overview: string;
  readonly architecture?: string;
  readonly highlights: readonly string[];
}

/**
 * One project entry. Front end and back end of the same product are separate entries that share
 * `product`; images live in `src/assets/projects/<slug>/` (see the README there).
 */
export interface ProjectEntry {
  /** URL-safe id: image folder name and deep link (`#project-<slug>`). */
  readonly slug: string;
  /** Shared by every entry of the same product (links front ↔ back in the detail view). */
  readonly product: string;
  readonly part: ProjectPart;
  /** Detail template: web (screenshots), mobile (phone screens) or backend (text first). */
  readonly kind: ProjectKind;
  readonly category: ProjectCategory;
  readonly accent: AccentKey;
  /** Public URLs only: `live` (the app itself), `site` (product/marketing site), `repo`. */
  readonly links?: { readonly live?: string; readonly site?: string; readonly repo?: string };
  readonly stack: Readonly<Partial<Record<StackGroup, readonly TechRef[]>>>;
  /** 4–6 chips for the card; defaults to the first six stack items. */
  readonly chips?: readonly TechRef[];
  /** Set for co-authored projects. */
  readonly team?: ProjectTeam;
  /** Fill behind a cover that is framed with `contain` (too small to cover its cell). */
  readonly coverBackdrop?: string;
  /** Gallery shot used as the card image when there is no `cover.*` file (default `01`). */
  readonly cover?: string;
  /** Per-image captions (alt text and lightbox caption), keyed by file name: `cover`, `01` … */
  readonly captions?: Readonly<Record<string, Readonly<Record<Locale, string>>>>;
  readonly copy: Readonly<Record<Locale, ProjectText>>;
}

/** Shared overview of a multi-part product, shown in the detail view of each of its entries. */
export interface EcosystemText {
  readonly title: string;
  readonly overview: string;
  readonly rows: readonly { readonly label: string; readonly text: string }[];
}

export interface ProductEcosystem {
  readonly copy: Readonly<Record<Locale, EcosystemText>>;
}

export interface ExperienceFact {
  readonly id: string;
  readonly company: string;
  readonly location: string;
  readonly accent: AccentKey;
  readonly current: boolean;
  readonly tech: readonly TechChip[];
}

export interface TestimonialFact {
  readonly id: string;
  /** Given name(s), shown on the first line. */
  readonly givenName: string;
  /** Family name(s), shown on the second line. */
  readonly familyName: string;
  readonly initials: string;
  /** Avatar fill from the vivid palette (initials in black pass AA on every fill). */
  readonly accent: AccentKey;
}

export interface Profile {
  readonly fullName: string;
  readonly nameLines: readonly [RichText, RichText];
  readonly brand: string;
  readonly logo: string;
  readonly location: string;
  readonly contactEmail: string;
  readonly yearsOfExperience: string;
  readonly cv: Readonly<Record<'en' | 'es', string>>;
  readonly socials: readonly SocialLink[];
  readonly skills: readonly SkillFact[];
  readonly experience: readonly ExperienceFact[];
  readonly testimonials: readonly TestimonialFact[];
  readonly siteUrl: string;
}

/* ---------- Localized copy ---------- */

export interface MetaCopy {
  readonly title: string;
  readonly description: string;
  readonly ogTitle: string;
  readonly ogDescription: string;
  readonly siteName: string;
}

export interface UiCopy {
  readonly nav: Readonly<Record<SectionId, string>>;
  readonly navLabel: string;
  readonly toggleMenu: string;
  readonly toggleTheme: string;
  readonly languageLabel: string;
  readonly languageNames: Readonly<Record<'en' | 'es', string>>;
  readonly railLabel: string;
  readonly railJumpTo: string;
  readonly railSectionsLabel: string;
  readonly skipToContent: string;
  readonly opensInNewTab: string;
}

export interface HeroCopy {
  readonly greeting: string;
  readonly tagline: string;
  readonly roles: readonly string[];
  readonly statusLabel: string;
  readonly statusValue: string;
  readonly experienceLabel: string;
  readonly ctaPrimary: string;
  readonly ctaSecondary: string;
  readonly portraitAlt: string;
}

export interface AboutCopy {
  readonly heading: RichText;
  readonly role: string;
  readonly bio: readonly [string, string, string];
  /** Professional profile from the CV. */
  readonly profile: string;
  readonly languages: { readonly label: string; readonly value: string };
  readonly cvButtons: Readonly<Record<'en' | 'es', string>>;
  readonly cvHelper: string;
  readonly portraitAlt: string;
}

export interface SkillsCopy {
  readonly title: string;
  readonly heading: RichText;
  readonly subtitle: string;
  readonly description: string;
  readonly allLabel: string;
  readonly categories: Readonly<Record<SkillCategory, string>>;
}

export interface ExperienceCopy {
  readonly id: string;
  readonly position: string;
  readonly period: string;
  readonly description?: string;
  readonly responsibilities: readonly string[];
  readonly achievements: readonly string[];
}

export interface EducationCopy {
  readonly title: string;
  readonly institution: string;
  readonly period: string;
  readonly description: string;
  readonly category: EducationCategory;
}

export interface ResumeCopy {
  readonly title: string;
  readonly heading: RichText;
  readonly subtitle: string;
  readonly workHeading: string;
  readonly educationHeading: string;
  readonly tasksLabel: string;
  readonly achievementsLabel: string;
  readonly presentLabel: string;
  readonly educationCategories: Readonly<Record<EducationCategory, string>>;
  readonly experience: readonly ExperienceCopy[];
  readonly education: readonly EducationCopy[];
}

export interface ProjectsCopy {
  readonly title: string;
  readonly heading: RichText;
  readonly intro: string;
  readonly confidentiality: string;
  readonly filters: Readonly<Record<'all' | ProjectCategory, string>>;
  readonly categoryLabels: Readonly<Record<ProjectCategory, string>>;
  /** Compact category for the card header. */
  readonly categoryShort: Readonly<Record<ProjectCategory, string>>;
  readonly demoLabel: string;
  readonly siteLabel: string;
  readonly codeLabel: string;
  readonly technologiesLabel: string;
  readonly detail: ProjectDetailCopy;
}

export interface ProjectDetailCopy {
  readonly open: string;
  readonly close: string;
  readonly overview: string;
  readonly architecture: string;
  readonly highlights: string;
  readonly stack: string;
  readonly media: string;
  readonly related: string;
  readonly ecosystem: string;
  readonly team: Readonly<Record<ProjectTeam, string>>;
  readonly imageSoon: string;
  readonly openImage: string;
  readonly previousImage: string;
  readonly nextImage: string;
  readonly stackGroups: Readonly<Record<StackGroup, string>>;
  readonly parts: Readonly<Record<ProjectPart, string>>;
  readonly kinds: Readonly<Record<ProjectKind, string>>;
}

export interface TestimonialCopy {
  readonly id: string;
  readonly role: string;
  readonly quote: string;
}

export interface TestimonialsCopy {
  readonly title: string;
  readonly heading: RichText;
  readonly items: readonly TestimonialCopy[];
}

export interface ContactCopy {
  readonly title: string;
  readonly heading: RichText;
  readonly subtitle: string;
  readonly text: string;
  readonly emailLabel: string;
  readonly form: {
    readonly nameLabel: string;
    readonly namePlaceholder: string;
    readonly emailLabel: string;
    readonly emailPlaceholder: string;
    readonly messageLabel: string;
    readonly messagePlaceholder: string;
    readonly submit: string;
    readonly sending: string;
    /** Outcome announced after a submit; `{hours}` is replaced with the hours until the limit resets. */
    readonly status: {
      readonly success: string;
      readonly rateLimited: string;
      readonly error: string;
    };
    readonly errors: {
      readonly name: string;
      readonly email: string;
      readonly message: string;
    };
  };
}

export interface FooterCopy {
  readonly text: string;
  readonly linksHeading: string;
  readonly followHeading: string;
  readonly legal: string;
}

export interface LocalizedCopy {
  readonly meta: MetaCopy;
  readonly ui: UiCopy;
  readonly hero: HeroCopy;
  readonly about: AboutCopy;
  readonly skills: SkillsCopy;
  readonly resume: ResumeCopy;
  readonly projects: ProjectsCopy;
  readonly testimonials: TestimonialsCopy;
  readonly contact: ContactCopy;
  readonly footer: FooterCopy;
}
