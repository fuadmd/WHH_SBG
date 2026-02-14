
import { Project, Lesson, User, MonthlyReport, InternalOffer, Product, ForumPost, ForumComment, Reaction } from './types';

// Demo users are hidden - only show logged-in users
export const MOCK_USERS: User[] = [];

// Original demo users (hidden from UI)
const DEMO_USERS: User[] = [
  { id: 'admin1', name: 'Super Admin', email: 'admin@sbg.org', role: 'ADMIN', adminPermission: 'SUPER_ADMIN', banFromForum: false, banFromMarket: false },
  { id: 'admin2', name: 'Content Manager', email: 'manager@sbg.org', role: 'ADMIN', adminPermission: 'MANAGER', banFromForum: false, banFromMarket: false },
  { id: 'user1', name: 'Amal Mansour', email: 'amal@example.com', role: 'BENEFICIARY', beneficiaryId: 'p1', banFromForum: false, banFromMarket: false },
  { id: 'user2', name: 'Omar Khaled', email: 'omar@example.com', role: 'BENEFICIARY', beneficiaryId: 'p2', banFromForum: false, banFromMarket: false },
];

// Get demo users for internal use only
export const getDemoUsers = () => DEMO_USERS;

const MOCK_PRODUCTS_P1: Product[] = [
  {
    id: 'pr1',
    name: 'Organic Basil Bundle',
    description: 'Freshly harvested hydroponic basil, grown without any chemical pesticides.',
    features: ['100% Organic', 'Pesticide-Free', 'Local Lebanon Product'],
    price: 4.50,
    currency: 'USD',
    category: 'Agriculture',
    images: ['https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&q=80&w=400'],
    salesCount: 245,
    // Fix: Added missing properties from Product interface
    stockStatus: 'IN_STOCK',
    isPublished: true
  },
  {
    id: 'pr2',
    name: 'Gourmet Salad Mix',
    description: 'A vibrant mix of baby greens including kale, spinach, and arugula.',
    features: ['High Nutrient Content', 'Washed & Ready', 'Lasts up to 7 days'],
    price: 6.00,
    currency: 'USD',
    category: 'Agriculture',
    images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400'],
    salesCount: 112,
    // Fix: Added missing properties from Product interface
    stockStatus: 'IN_STOCK',
    isPublished: true
  }
];

const MOCK_PRODUCTS_P2: Product[] = [
  {
    id: 'pr3',
    name: 'Screen Repair Kit',
    description: 'High-quality replacement screen for common smartphone models.',
    features: ['OEM Quality', 'Tools Included'],
    price: 25.00,
    currency: 'USD',
    category: 'Tech',
    images: ['https://images.unsplash.com/photo-1512446816042-444d641267d4?auto=format&fit=crop&q=80&w=400'],
    salesCount: 56,
    // Fix: Added missing properties from Product interface
    stockStatus: 'IN_STOCK',
    isPublished: true
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Green Harvest Lebanon',
    subtitle: 'Urban farming for a greener Beirut',
    ownerName: 'Amal Mansour',
    ownerGender: 'FEMALE',
    projectType: 'ESTABLISHED',
    category: 'Agriculture',
    specificSector: 'Hydroponics & Organic Greens',
    description: 'Specializing in pesticide-free urban agriculture solutions.',
    location: 'Beirut',
    detailedLocation: {
      province: 'Beirut',
      city: 'Beirut',
      village: 'Achrafieh',
      neighborhood: 'Sassine',
      street: 'Main St.',
      landmark: 'Next to Sassine Square',
      coordinates: { lat: 33.8869, lng: 35.5131 }
    },
    status: 'ACTIVE',
    storeStatus: 'OPEN',
    rating: 4.9,
    contact: { whatsapp: '+96170123456', phone: '+9611234567', email: 'green@harvest.lb' },
    socialLinks: { facebook: 'greenharvestlb', instagram: 'greenharvest_lb' },
    paymentMethods: ['Cash', 'Wish Money', 'Bank Transfer'],
    imageUrl: 'https://images.unsplash.com/photo-1530836361253-ee8ef2f990a2?auto=format&fit=crop&q=80&w=800',
    gallery: [],
    products: MOCK_PRODUCTS_P1,
    createdAt: '2023-10-01',
    totalSales: 4500,
    views: 12000
  },
  {
    id: 'p2',
    name: 'Tech Fix Solutions',
    subtitle: 'Reliable mobile repairs',
    ownerName: 'Omar Khaled',
    ownerGender: 'MALE',
    projectType: 'STARTUP',
    category: 'Tech',
    specificSector: 'Electronics & Smartphone Repair',
    description: 'Providing component-level repair for local students and businesses.',
    location: 'Tripoli',
    detailedLocation: {
      province: 'North Lebanon',
      city: 'Tripoli',
      village: 'Tripoli',
      neighborhood: 'Dam w Farez',
      street: 'Hospital St.',
      landmark: 'Opposite Nini Hospital',
      coordinates: { lat: 34.4333, lng: 35.8333 }
    },
    status: 'EMERGING',
    storeStatus: 'CLOSED',
    rating: 4.5,
    contact: { whatsapp: '+96171987654', phone: '+9616123456', email: 'tech@fix.lb' },
    socialLinks: { instagram: 'techfix_tripoli' },
    paymentMethods: ['Cash', 'Credit Card'],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    gallery: [],
    products: MOCK_PRODUCTS_P2,
    createdAt: '2023-11-15',
    totalSales: 1200,
    views: 5400
  }
];

export const MOCK_LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'Digital Marketing Fundamentals',
    category: 'MARKETING',
    type: 'VIDEO',
    content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '08:45',
    description: 'Learn how to use social media to grow your small business presence.',
    thumbnail: 'https://picsum.photos/seed/mkt/400/225',
    // Added missing createdAt
    createdAt: '2023-12-01T10:00:00Z'
  },
  {
    id: 'l2',
    title: 'Financial Planning 101',
    category: 'FINANCE',
    type: 'TEXT',
    content: 'Managing your cash flow is the most important skill for any small business owner. Always keep at least 3 months of operating expenses in reserve.',
    description: 'Key principles of managing business finances and cash flow.',
    // Added missing createdAt
    createdAt: '2023-12-05T14:30:00Z'
  }
];

export const MOCK_REPORTS: MonthlyReport[] = [
  { id: 'r1', beneficiaryId: 'p1', month: '2024-01', sales: 1200, expenses: 800, challenges: 'High electricity costs.', supportRequests: 'Marketing mentorship.', submittedAt: '2024-02-01' },
];

export const MOCK_NETWORK: InternalOffer[] = [
  { 
    id: 'n1', 
    fromId: 'p1', 
    type: 'EXPERIENCE', 
    title: 'Success with Local Packaging', 
    description: 'I recently switched to recycled cardboard for my greens. Highly recommend checking out the factory in Tripoli.', 
    date: '2024-05-10',
    media: [{ type: 'IMAGE', url: 'https://images.unsplash.com/photo-1589939705384-5185138a047a?auto=format&fit=crop&q=80&w=400' }]
  }
];

// Forum Posts Mock Data
export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post1',
    authorId: 'user1',
    authorName: 'Amal Mansour',
    title: 'Tips for Starting an E-commerce Business',
    content: [
      {
        type: 'TEXT',
        text: 'I want to share my experience in starting an e-commerce business. I started with a small capital and managed to achieve significant growth in the first year.'
      }
    ],
    createdAt: '2024-02-10T10:30:00Z',
    likes: 12,
    commentsCount: 3,
    isEdited: false
  },
  {
    id: 'post2',
    authorId: 'user2',
    authorName: 'Omar Khaled',
    title: 'Request for Help: Dealing with Difficult Customers',
    content: [
      {
        type: 'TEXT',
        text: 'Hello, I am facing difficulty dealing with some customers who complain constantly. Do you have any tips or strategies that could help me?'
      }
    ],
    createdAt: '2024-02-09T14:15:00Z',
    likes: 8,
    commentsCount: 5,
    isEdited: false
  }
];

// Forum Comments Mock Data
export const MOCK_FORUM_COMMENTS: ForumComment[] = [
  {
    id: 'comment1',
    postId: 'post1',
    authorId: 'user2',
    authorName: 'Omar Khaled',
    content: 'Thank you for sharing. Can you tell me more about the platforms you used?',
    createdAt: '2024-02-10T11:00:00Z',
    reactions: [],
    isEdited: false
  },
  {
    id: 'comment2',
    postId: 'post2',
    authorId: 'user1',
    authorName: 'Amal Mansour',
    content: 'From my experience, I recommend active listening and empathy with customers. Try to understand their real needs.',
    createdAt: '2024-02-09T15:30:00Z',
    reactions: [],
    replies: [
      {
        id: 'reply1',
        postId: 'post2',
        parentCommentId: 'comment2',
        authorId: 'user2',
        authorName: 'Omar Khaled',
        content: 'Thank you for the advice. I will apply it with my customers.',
        createdAt: '2024-02-09T16:00:00Z',
        reactions: [],
        isEdited: false
      }
    ],
    isEdited: false
  }
];

// Reactions Mock Data
export const MOCK_REACTIONS: Reaction[] = [
  {
    id: 'react1',
    postId: 'post1',
    userId: 'user2',
    type: 'LOVE',
    createdAt: '2024-02-10T10:45:00Z'
  },
  {
    id: 'react2',
    postId: 'post1',
    userId: 'user1',
    type: 'LIKE',
    createdAt: '2024-02-10T10:50:00Z'
  }
];
