export const mockFeedPosts = [
  {
    id: 991,
    content: "🚀 Excited to announce that FoodGo is now deployed live to production! It's a full-stack food ordering platform built using React 19, Spring Boot 3, and PostgreSQL. Integrated real-time delivery status, geospatial queries, and clean architecture.\n\nAll skills used in this build have been verified on my LinkSphere Proof Chain! Check out the GitHub repo and live demo below.",
    category: "Project Update",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
    author: {
      id: 2,
      firstName: "Alex",
      lastName: "Morgan",
      headline: "Senior Full-Stack Engineer @ CloudSphere",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      role: "ROLE_USER"
    },
    projectSnippet: {
      title: "FoodGo - Food Delivery Platform",
      stack: ["React", "Spring Boot", "PostgreSQL"],
      demoUrl: "https://foodgo-preview.app",
      githubUrl: "https://github.com/rohinth-coder/foodgo-delivery"
    },
    likeCount: 28,
    commentCount: 6,
    likedByCurrentUser: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 992,
    content: "🎯 Proud to share that I just earned the Oracle Certified Professional: Java SE 17 Developer credential! Scored 94% on core multithreading, concurrency, and virtual thread patterns. My verified credential is now linked to my LinkSphere Java Proof Chain.",
    category: "Certification",
    imageUrl: null,
    author: {
      id: 3,
      firstName: "Sarah",
      lastName: "Chen",
      headline: "Distributed Systems & Machine Learning Engineer",
      profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
      role: "ROLE_USER"
    },
    certificateSnippet: {
      name: "Oracle Certified Professional: Java SE 17",
      credentialId: "OCP-JAVA17-88219",
      issuer: "Oracle University"
    },
    likeCount: 45,
    commentCount: 9,
    likedByCurrentUser: true,
    createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
  },
  {
    id: 993,
    content: "💡 Key architectural takeaway from scaling Spring Boot 3 virtual threads: By eliminating reactive callback hell with structured concurrency, we reduced server memory footprint by 40% while handling 10k concurrent HTTP calls easily. Always benchmark your thread pools before optimizing!",
    category: "Learning",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    author: {
      id: 4,
      firstName: "David",
      lastName: "Kowalski",
      headline: "Platform Engineer & Open Source Maintainer",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      role: "ROLE_USER"
    },
    likeCount: 62,
    commentCount: 14,
    likedByCurrentUser: false,
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  }
];
