export const mockConversations = [
  {
    id: 1,
    participant: {
      id: 2,
      name: "Alex Morgan",
      role: "Lead Full-Stack Engineer @ CloudSphere",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      online: true,
      headline: "Building scalable Spring Boot microservices & React web apps"
    },
    unreadCount: 1,
    lastMessage: {
      text: "Hey! Loved your FoodGo project architecture. Are you open to discussing a frontend internship?",
      timestamp: "10:45 AM",
      senderId: 2
    },
    messages: [
      {
        id: 101,
        senderId: 2,
        text: "Hi there! I came across your LinkSphere profile and saw your verified React & Spring Boot Proof Chain.",
        timestamp: "Yesterday, 4:20 PM"
      },
      {
        id: 102,
        senderId: 1,
        text: "Thanks Alex! I've been focusing on connecting skills directly with deployed projects and certifications.",
        timestamp: "Yesterday, 4:35 PM"
      },
      {
        id: 103,
        senderId: 2,
        text: "Hey! Loved your FoodGo project architecture. Are you open to discussing a frontend internship?",
        timestamp: "10:45 AM"
      }
    ]
  },
  {
    id: 2,
    participant: {
      id: 3,
      name: "Sarah Chen",
      role: "AI Systems Architect @ NeuralFlow",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
      online: false,
      headline: "Distributed Systems & Machine Learning Engineering"
    },
    unreadCount: 0,
    lastMessage: {
      text: "Thanks for accepting the connection! Let's connect at the Chennai Tech Summit next week.",
      timestamp: "Yesterday",
      senderId: 3
    },
    messages: [
      {
        id: 201,
        senderId: 3,
        text: "Hi! Excited to connect with fellow engineers in the LinkSphere ecosystem.",
        timestamp: "Sep 17, 2:15 PM"
      },
      {
        id: 202,
        senderId: 1,
        text: "Great to connect with you too Sarah! Looking forward to learning more about your AI work.",
        timestamp: "Sep 17, 2:40 PM"
      },
      {
        id: 203,
        senderId: 3,
        text: "Thanks for accepting the connection! Let's connect at the Chennai Tech Summit next week.",
        timestamp: "Yesterday, 11:10 AM"
      }
    ]
  },
  {
    id: 3,
    participant: {
      id: 4,
      name: "David Kowalski",
      role: "Platform Engineer & Open Source Maintainer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      online: true,
      headline: "Java 21 Enthusiast & Kubernetes Automation"
    },
    unreadCount: 0,
    lastMessage: {
      text: "Your Virtual Threads benchmark post was super insightful. Let's collaborate on the Docker sandbox!",
      timestamp: "3 days ago",
      senderId: 4
    },
    messages: [
      {
        id: 301,
        senderId: 4,
        text: "Your Virtual Threads benchmark post was super insightful. Let's collaborate on the Docker sandbox!",
        timestamp: "Sep 15, 6:02 PM"
      }
    ]
  }
];
