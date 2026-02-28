export const MOCK_CONTEXTS = [
    {
        id: 1,
        name: "Hackathon 2026",
        tag: "Active",
        icon: "Zap",
        score: 87,
        status: "Excellent",
        statusDesc: "Context is well-organized",
        metrics: {
            completeness: 92,
            connections: 75,
            freshness: 79
        },
        time: "2 mins ago",
        members: [
            { id: "m1", initials: "SC", name: "Sarah Chen", role: "Owner", color: "bg-teal-500", online: true },
            { id: "m2", initials: "AK", name: "Alex Kim", role: "Editor", color: "bg-amber-600", online: true },
            { id: "m3", initials: "MR", name: "Marcus R.", role: "Editor", color: "bg-cyan-500", online: false },
            { id: "m4", initials: "JT", name: "Jamie T.", role: "Viewer", color: "bg-purple-600", online: false },
        ],
        tags: ["#hackathon", "#AI", "#2026", "#ContextOS"],
        activity: [
            { id: "a1", user: "You", action: "Added note", target: "Architecture Decision Record", time: "2m ago", color: "bg-purple-500" },
            { id: "a2", user: "Alex", action: "Completed task", target: "Setup CI/CD Pipeline", time: "14m ago", color: "bg-green-500", strike: true },
            { id: "a3", user: "Sarah", action: "Uploaded file", target: "wireframes_v3.fig", time: "1h ago", color: "bg-pink-500" }
        ],
        notes: [
            { id: "h1", title: "Core Thesis", content: "Context collapses app silos.", type: "note" },
            { id: "h2", title: "Architecture", content: "Graph-based relational model.", type: "note" }
        ],
        tasks: [
            { id: "t1", title: "Finish graph view", status: "completed", type: "task" },
            { id: "t2", title: "Smart search", status: "completed", type: "task" },
            { id: "t3", title: "Activity heatmap", status: "pending", type: "task" }
        ],
        files: [
            { id: "f1", title: "Wireframes.pdf", type: "file" },
            { id: "f2", title: "Brand_Assets.zip", type: "file" }
        ],
        deadlines: [
            { id: "d1", title: "MVP Submission", date: "2026-03-05", type: "deadline" }
        ]
    },
    {
        id: 2,
        name: "Series A Prep",
        tag: "In Review",
        icon: "Rocket",
        score: 64,
        status: "Good",
        statusDesc: "Showing strong momentum",
        metrics: {
            completeness: 65,
            connections: 58,
            freshness: 92
        },
        time: "1 hour ago",
        members: [
            { id: "m1", initials: "YC", name: "YC Founder", role: "Owner", color: "bg-indigo-500", online: true },
            { id: "m2", initials: "DM", name: "David M.", role: "Finance", color: "bg-rose-500", online: true },
            { id: "m3", initials: "EL", name: "Elena L.", role: "Legal", color: "bg-emerald-500", online: false },
        ],
        tags: ["#fundraising", "#seriesA", "#growth"],
        activity: [
            { id: "a1", user: "David", action: "Updated", target: "Financial Model", time: "45m ago", color: "bg-amber-500" },
            { id: "a2", user: "Elena", action: "Shared", target: "Cap Table v2", time: "2h ago", color: "bg-cyan-500" }
        ],
        notes: [
            { id: "s1", title: "Investor List", content: "Targeting Sequoia and A16Z.", type: "note" },
            { id: "s2", title: "Pitch Deck Outline", content: "Focus on retention metrics.", type: "note" }
        ],
        tasks: [
            { id: "st1", title: "Update financial model", status: "pending", type: "task" },
            { id: "st2", title: "Review cap table", status: "pending", type: "task" }
        ],
        files: [
            { id: "sf1", title: "Series_A_Deck_v3.pptx", type: "file" }
        ],
        deadlines: [
            { id: "sd1", title: "Investor Meeting", date: "2026-03-10", type: "deadline" }
        ]
    },
    {
        id: 3,
        name: "Product Roadmap",
        tag: "Planning",
        icon: "BookOpen",
        score: 42,
        status: "Developing",
        statusDesc: "Early planning phase",
        metrics: {
            completeness: 40,
            connections: 30,
            freshness: 85
        },
        time: "3 hours ago",
        members: [
            { id: "m1", initials: "YC", name: "YC Founder", role: "Owner", color: "bg-indigo-500", online: true },
            { id: "m2", initials: "TK", name: "Tom K.", role: "PM", color: "bg-orange-500", online: false },
        ],
        tags: ["#roadmap", "#Q3", "#vision"],
        activity: [
            { id: "a1", user: "You", action: "Updated", target: "Q3 Strategy", time: "3h ago", color: "bg-purple-500" }
        ],
        notes: [
            { id: "p1", title: "Q3 Strategy", content: "Expansion into B2B.", type: "note" }
        ],
        tasks: [
            { id: "pt1", title: "User interviews", status: "pending", type: "task" }
        ],
        files: [],
        deadlines: []
    },
    {
        id: 4,
        name: "ML Research",
        tag: "Active",
        icon: "Brain",
        score: 91,
        status: "Exceptional",
        statusDesc: "Highly interconnected nodes",
        metrics: {
            completeness: 95,
            connections: 88,
            freshness: 72
        },
        time: "Yesterday",
        members: [
            { id: "m1", initials: "SC", name: "Sarah Chen", role: "Reviewer", color: "bg-teal-500", online: true },
            { id: "m2", initials: "DR", name: "Dr. Rivet", role: "Scientist", color: "bg-blue-600", online: true },
        ],
        tags: ["#ML", "#Research", "#Transformer"],
        activity: [
            { id: "a1", user: "Dr. Rivet", action: "Added", target: "Training Logs v4", time: "5h ago", color: "bg-blue-500" }
        ],
        notes: [
            { id: "m1", title: "Transformer Efficiency", content: "Analyzing sparse attention.", type: "note" }
        ],
        tasks: [
            { id: "mt1", title: "Train v2.1 model", status: "pending", type: "task" }
        ],
        files: [
            { id: "mf1", title: "Research_Paper.pdf", type: "file" }
        ],
        deadlines: []
    },
    {
        id: 5,
        name: "Brand Refresh",
        tag: "Discovery",
        icon: "Sparkles",
        score: 45,
        status: "Beginning",
        statusDesc: "Initial assets gathered",
        metrics: {
            completeness: 35,
            connections: 20,
            freshness: 98
        },
        time: "2 days ago",
        members: [
            { id: "m1", initials: "YC", name: "YC Founder", role: "Owner", color: "bg-indigo-500", online: true },
        ],
        tags: ["#branding", "#design", "#identity"],
        activity: [],
        notes: [],
        tasks: [],
        files: [],
        deadlines: []
    }
];

export const RECENT_SEARCHES = [
    { id: 1, title: "Architecture Doc", type: "note" },
    { id: 2, title: "Sprint Planning", type: "task" },
    { id: 3, title: "Wireframes", type: "file" }
];

export const PINNED_ITEMS = [
    { id: 1, title: "Hackathon 2026", type: "context" },
    { id: 2, title: "Series A Pitch", type: "file" },
    { id: 3, title: "Roadmap Q2", type: "note" }
];
