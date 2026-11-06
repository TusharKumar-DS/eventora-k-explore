/* Event data — edit this file to add or change events. */
const EVENTS = [
  {
    id: "tech-summit", title: "NextGen Tech Summit 2026", category: "Technology",
    date: "2026-12-12T09:30:00+05:30", venue: "Convention Hall A", city: "Bhubaneswar",
    img: "assets/images/tech-summit.jpg", price: 499, seats: 300, featured: true,
    short: "A full-day summit on cloud, AI and the future of software with industry speakers.",
    description: "Join engineers, founders and students for a day of keynotes, live demos and networking. Explore trends in cloud, AI, cybersecurity and open source, and meet teams hiring for internships and full-time roles.",
    schedule: [["09:30", "Registration & welcome coffee"], ["10:30", "Keynote: Building for the next billion users"], ["13:00", "Lunch & networking"], ["14:00", "Panels: AI in production"], ["17:00", "Closing & prizes"]]
  },
  {
    id: "hack-night", title: "Midnight Hack 24", category: "Technology",
    date: "2026-12-19T18:00:00+05:30", venue: "Innovation Lab", city: "Bhubaneswar",
    img: "assets/images/hack-night.jpg", price: 0, seats: 120, featured: false,
    short: "A 24-hour hackathon. Build, break and ship something amazing with your team.",
    description: "Teams of up to four build a working prototype in 24 hours around the theme 'Tech for Campus Life'. Mentors will be on hand, food is provided, and the best projects win prizes and incubation support.",
    schedule: [["18:00", "Kick-off & theme reveal"], ["20:00", "Hacking begins"], ["02:00", "Midnight snacks & mentor round"], ["16:00", "Submissions close"], ["18:00", "Demos & results"]]
  },
  {
    id: "music-fest", title: "Rhythm & Roots Music Fest", category: "Music",
    date: "2027-01-09T17:00:00+05:30", venue: "Open Air Arena", city: "Cuttack",
    img: "assets/images/music-fest.jpg", price: 799, seats: 800, featured: true,
    short: "Live bands, indie artists and folk fusion under the open sky.",
    description: "An evening of live performances by independent and folk-fusion artists, with food stalls, art installations and a silent disco after the main show.",
    schedule: [["17:00", "Gates open"], ["18:00", "Opening act"], ["19:30", "Headline performance"], ["21:30", "Silent disco"]]
  },
  {
    id: "classical-eve", title: "An Evening of Classical Dance", category: "Cultural",
    date: "2027-01-16T18:30:00+05:30", venue: "Rabindra Mandap", city: "Bhubaneswar",
    img: "assets/images/classical-eve.jpg", price: 250, seats: 400, featured: false,
    short: "Odissi and Bharatanatyam performances by leading artists.",
    description: "A celebration of classical Indian dance, featuring acclaimed performers, live orchestra and a short talk on the history of Odissi.",
    schedule: [["18:30", "Seating"], ["19:00", "Odissi recital"], ["20:00", "Interval"], ["20:15", "Bharatanatyam recital"]]
  },
  {
    id: "marathon", title: "City Run Marathon 10K", category: "Sports",
    date: "2026-12-06T05:30:00+05:30", venue: "Marine Drive Start Line", city: "Puri",
    img: "assets/images/marathon.jpg", price: 350, seats: 1000, featured: true,
    short: "A scenic 10K run along the coast. Walkers and runners welcome.",
    description: "Run, jog or walk the coastal route. Every participant receives a finisher medal, a t-shirt and a post-race breakfast. Timing chips provided for 10K runners.",
    schedule: [["05:30", "Warm-up"], ["06:00", "10K flag-off"], ["06:15", "5K fun walk"], ["08:30", "Medals & breakfast"]]
  },
  {
    id: "cricket-cup", title: "Inter-College Cricket Cup", category: "Sports",
    date: "2027-02-06T08:00:00+05:30", venue: "Central Stadium", city: "Bhubaneswar",
    img: "assets/images/cricket-cup.jpg", price: 100, seats: 600, featured: false,
    short: "16 college teams, one trophy. Cheer for your campus!",
    description: "A knockout T20 tournament between 16 colleges. Come support your team, enjoy food stalls and join the live fan zone.",
    schedule: [["08:00", "Opening ceremony"], ["09:00", "Quarter-finals"], ["14:00", "Semi-finals"], ["17:00", "Grand final"]]
  },
  {
    id: "design-workshop", title: "UI/UX Design Sprint Workshop", category: "Workshop",
    date: "2026-11-28T10:00:00+05:30", venue: "Studio 3, Design Block", city: "Bhubaneswar",
    img: "assets/images/design-workshop.jpg", price: 299, seats: 40, featured: false,
    short: "A hands-on workshop: go from problem to clickable prototype in one day.",
    description: "Learn the design sprint method: user research, ideation, wireframes and prototyping in Figma. Bring a laptop. No prior design experience needed.",
    schedule: [["10:00", "Understand & define"], ["11:30", "Sketch & decide"], ["14:00", "Prototype"], ["16:00", "User testing & demo"]]
  },
  {
    id: "ai-bootcamp", title: "AI & Machine Learning Bootcamp", category: "Workshop",
    date: "2027-01-23T09:00:00+05:30", venue: "Computer Lab 2", city: "Bhubaneswar",
    img: "assets/images/ai-bootcamp.jpg", price: 599, seats: 60, featured: false,
    short: "Train and deploy your first ML model in a single weekend day.",
    description: "A beginner-friendly bootcamp covering Python, data cleaning, model training and deploying a simple model as a web app.",
    schedule: [["09:00", "Python & data basics"], ["11:30", "Training models"], ["14:00", "Deployment"], ["16:30", "Showcase"]]
  },
  {
    id: "startup-pitch", title: "Startup Pitch Arena", category: "Business",
    date: "2026-12-22T11:00:00+05:30", venue: "Incubation Centre", city: "Bhubaneswar",
    img: "assets/images/startup-pitch.jpg", price: 0, seats: 150, featured: false,
    short: "Watch student founders pitch to real investors and mentors.",
    description: "Ten shortlisted teams pitch their startup ideas to a panel of investors. Audience members vote for the People's Choice award.",
    schedule: [["11:00", "Welcome"], ["11:30", "Pitch round 1"], ["14:00", "Pitch round 2"], ["16:00", "Awards"]]
  },
  {
    id: "career-expo", title: "Campus Career Expo", category: "Business",
    date: "2027-02-13T10:00:00+05:30", venue: "Exhibition Grounds", city: "Bhubaneswar",
    img: "assets/images/career-expo.jpg", price: 0, seats: 2000, featured: false,
    short: "Meet 80+ recruiters, attend resume clinics and mock interviews.",
    description: "Meet hiring teams from startups and large companies, get your resume reviewed by experts and try a mock interview.",
    schedule: [["10:00", "Doors open"], ["11:00", "Resume clinics"], ["13:00", "Mock interviews"], ["16:00", "Closing talk"]]
  },
  {
    id: "cultural-fest", title: "Utsav Cultural Fest", category: "Cultural",
    date: "2027-01-30T16:00:00+05:30", venue: "Main Auditorium", city: "Bhubaneswar",
    img: "assets/images/cultural-fest.jpg", price: 150, seats: 500, featured: true,
    short: "Dance, drama, art and food from across the country in one festival.",
    description: "A vibrant campus festival with stage performances, street plays, an art gallery and regional food stalls.",
    schedule: [["16:00", "Inauguration"], ["17:00", "Stage performances"], ["19:00", "Street play"], ["20:00", "Food festival"]]
  },
  {
    id: "photo-walk", title: "Golden Hour Photo Walk", category: "Workshop",
    date: "2026-11-21T15:30:00+05:30", venue: "Old Town Heritage Lane", city: "Bhubaneswar",
    img: "assets/images/photo-walk.jpg", price: 199, seats: 25, featured: false,
    short: "Learn composition and light on a guided walk through heritage streets.",
    description: "A guided photography walk with a professional photographer. Any camera, including a phone, works. Learn composition, light and street storytelling.",
    schedule: [["15:30", "Meet & brief"], ["16:00", "Guided walk"], ["18:00", "Photo review"]]
  }
];
