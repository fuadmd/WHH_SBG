
export type UserRole = 'ADMIN' | 'BENEFICIARY' | 'VIEWER';
export type AdminPermission = 'SUPER_ADMIN' | 'MANAGER' | 'MODERATOR';
export type ThemeMode = 'light' | 'dark';
export type ReactionType = 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY';
export type PostContentType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'PDF' | 'FILE' | 'YOUTUBE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  adminPermission?: AdminPermission;
  beneficiaryId?: string;
  banFromForum?: boolean;
  banFromMarket?: boolean;
  banReason?: string;
  bannedAt?: string;
}

export interface SliderImage {
  id: string;
  url: string;
  active: boolean;
  order: number;
}

export interface SiteConfig {
  headerTitle: string;
  headerLogo: string;
  logoImageUrl?: string;
  subtitle?: string;
  footerText: string;
  marketplaceTitle: string;
  primaryColor: string;
  fontFamily: 'Inter' | 'Noto Sans Arabic' | 'System';
  showHeroSlider: boolean;
  heroSlider: SliderImage[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  currency: 'USD' | 'SYP' | 'TRY' | string;
  category: string;
  images: string[];
  salesCount: number;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LIMITED';
  quantity?: number;
  isPublished: boolean;
  specifications?: { label: string; value: string }[];
}

export interface DetailedLocation {
  province: string; // Governorate
  city: string;
  village: string;
  neighborhood: string;
  street: string;
  landmark: string;
  description?: string; // Optional text box for directions
  coordinates?: { lat: number, lng: number };
}

export interface Project {
  id: string;
  name: string;
  subtitle?: string; // Optional subtitle
  ownerName: string;
  ownerGender: 'MALE' | 'FEMALE';
  projectType: 'STARTUP' | 'ESTABLISHED';
  category: string; // General sector (e.g. Agriculture)
  specificSector: string; // Detailed sector
  description: string;
  location: string; // Governorate or City label
  detailedLocation: DetailedLocation;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EMERGING';
  storeStatus?: 'OPEN' | 'CLOSED' | 'AUTOMATIC';
  operatingHours?: { start: string; end: string };
  rating: number; // 0-5
  contact: {
    whatsapp: string;
    phone: string;
    email: string;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  paymentMethods: string[];
  imageUrl: string;
  logoUrl?: string;
  coverUrl?: string;
  gallery: string[];
  products: Product[];
  createdAt: string;
  totalSales: number;
  views: number;
}

export type LessonType = 'TEXT' | 'IMAGE' | 'FILE' | 'VIDEO';

export interface Lesson {
  id: string;
  title: string;
  category: 'MARKETING' | 'FINANCE' | 'OPERATIONS' | 'RISK' | string;
  type: LessonType;
  content: string; // Raw text or URL
  duration?: string;
  description: string;
  thumbnail?: string;
  createdAt: string;
}

export interface MonthlyReport {
  id: string;
  beneficiaryId: string;
  month: string;
  sales: number;
  expenses: number;
  challenges: string;
  supportRequests: string;
  submittedAt: string;
}

export interface InternalOffer {
  id: string;
  fromId: string;
  type: 'OFFER' | 'REQUEST' | 'EXPERIENCE';
  title: string;
  description: string;
  date: string;
  media?: { type: 'IMAGE' | 'VIDEO'; url: string }[];
}

// Forum & Social Interactions
export interface ForumPostContent {
  type: PostContentType;
  text?: string;
  url?: string;
  fileName?: string;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: ForumPostContent[];
  createdAt: string;
  updatedAt?: string;
  likes: number;
  commentsCount: number;
  isEdited: boolean;
}

export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  type: ReactionType;
  createdAt: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  parentCommentId?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  reactions: Reaction[];
  replies?: ForumComment[];
  isEdited: boolean;
}

export interface AppState {
  currentUser: User | null;
  language: 'EN' | 'AR';
  siteConfig: SiteConfig;
  hasNewAcademyContent: boolean;
  theme: ThemeMode;
}
