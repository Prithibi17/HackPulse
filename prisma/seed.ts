import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Clearing existing database records...');
  await prisma.discordPost.deleteMany();
  await prisma.teamRequest.deleteMany();
  await prisma.hackathonReminder.deleteMany();
  await prisma.savedHackathon.deleteMany();
  await prisma.hackathonChange.deleteMany();
  await prisma.hackathonSourceRecord.deleteMany();
  await prisma.crawlerSourceRun.deleteMany();
  await prisma.crawlerRun.deleteMany();
  await prisma.adminAuditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.guildSubscription.deleteMany();
  await prisma.discordGuild.deleteMany();
  await prisma.userSubscription.deleteMany();
  await prisma.hackathon.deleteMany();
  await prisma.user.deleteMany();

  console.log('🌱 Seeding sample Discord Guilds...');
  const guild1 = await prisma.discordGuild.create({
    data: {
      guildId: '100100100100100101',
      guildName: 'Dev Squad Community',
      icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop',
      postingChannelId: '200200200200200201',
      timezone: 'Asia/Kolkata',
      enabled: true,
      subscription: {
        create: {
          modes: JSON.stringify(['OFFLINE', 'HYBRID', 'ONLINE']),
          countries: JSON.stringify(['India']),
          states: JSON.stringify(['Rajasthan', 'Karnataka', 'Delhi']),
          cities: JSON.stringify(['Jaipur', 'Bengaluru', 'New Delhi']),
          themes: JSON.stringify(['AI', 'IoT', 'Web3', 'Cybersecurity', 'Open Innovation']),
          minPrize: 0,
          studentsOnly: false,
          newHackathons: true,
          registrationAlerts: true,
          deadlineAlerts: true,
          changeAlerts: true,
          dailyDigest: false,
          pingRoleId: '300300300300300301',
        },
      },
    },
  });

  const guild2 = await prisma.discordGuild.create({
    data: {
      guildId: '100200300400500600',
      guildName: 'Jaipur Hackers Club',
      icon: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=128&h=128&fit=crop',
      postingChannelId: '200300400500600700',
      timezone: 'Asia/Kolkata',
      enabled: true,
      subscription: {
        create: {
          modes: JSON.stringify(['OFFLINE']),
          countries: JSON.stringify(['India']),
          states: JSON.stringify(['Rajasthan']),
          cities: JSON.stringify(['Jaipur', 'Jodhpur', 'Udaipur']),
          themes: JSON.stringify(['AI', 'IoT', 'Robotics']),
          minPrize: 50000,
          studentsOnly: true,
          newHackathons: true,
          registrationAlerts: true,
          deadlineAlerts: true,
          changeAlerts: true,
          dailyDigest: true,
        },
      },
    },
  });

  console.log('🌱 Seeding realistic Hackathons...');

  // 1. HyperFusion 2026 (Jaipur, Rajasthan - Offline, Open)
  const hyperfusion = await prisma.hackathon.create({
    data: {
      name: 'HyperFusion 2026',
      slug: 'hyperfusion-2026',
      description: 'North India’s premier 36-hour offline hackathon bringing together visionary developers, designers, and innovators to build cutting-edge solutions across AI, IoT, and NextGen Systems.',
      organizerName: 'XYZ University Tech Club',
      organizerWebsite: 'https://xyz.edu.in',
      organizerLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=128&h=128&fit=crop',
      mode: 'OFFLINE',
      venueName: 'Auditorium Block A, XYZ University Campus',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      latitude: 26.9124,
      longitude: 75.7873,
      prizePool: 200000,
      prizeCurrency: 'INR',
      registrationStatus: 'OPEN',
      registrationOpenDate: new Date('2026-08-01T00:00:00.000Z'),
      registrationDeadline: new Date('2026-08-24T18:30:00.000Z'),
      eventStartDate: new Date('2026-08-27T04:30:00.000Z'),
      eventEndDate: new Date('2026-08-29T11:30:00.000Z'),
      teamMin: 2,
      teamMax: 4,
      eligibility: 'College Students & Recent Graduates',
      themes: JSON.stringify(['AI', 'IoT', 'Open Innovation', 'Smart City']),
      technologies: JSON.stringify(['Python', 'PyTorch', 'React', 'Raspberry Pi', 'ESP32', 'FastAPI']),
      registrationUrl: 'https://devfolio.co/hyperfusion-2026',
      officialWebsite: 'https://hyperfusion2026.xyz.edu.in',
      bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=400&fit=crop',
      sourceName: 'Devfolio',
      sourceUrl: 'https://devfolio.co/hyperfusion-2026',
      verified: true,
      verificationStatus: 'VERIFIED',
      verificationNote: 'Verified directly against official university portal and Devfolio partner feed.',
      sources: {
        create: [
          {
            sourceName: 'Devfolio',
            sourceId: 'devfolio-hyperfusion-2026',
            sourceUrl: 'https://devfolio.co/hyperfusion-2026',
            isCanonical: true,
            discoveredAt: new Date('2026-08-01T10:00:00Z'),
          },
          {
            sourceName: 'University Portal',
            sourceId: 'xyz-hyperfusion-26',
            sourceUrl: 'https://xyz.edu.in/events/hyperfusion-2026',
            isCanonical: false,
            discoveredAt: new Date('2026-08-01T12:00:00Z'),
          },
        ],
      },
      discordPosts: {
        create: [
          {
            guildId: guild1.guildId,
            channelId: '200200200200200201',
            messageId: '987654321098765432',
            postType: 'NEW_EVENT',
            postedAt: new Date('2026-08-01T12:30:00Z'),
          },
        ],
      },
    },
  });

  // 2. DesertHacks 2026 (Jodhpur, Rajasthan - Closing Soon)
  const deserthacks = await prisma.hackathon.create({
    data: {
      name: 'DesertHacks 2026',
      slug: 'deserthacks-2026',
      description: 'A national-level flagship hardware and software hackathon organized at IIT Jodhpur focusing on autonomous robotics, sustainable clean-tech, and Web3 decentralization.',
      organizerName: 'IIT Jodhpur Innovation Hub',
      organizerWebsite: 'https://iitj.ac.in',
      mode: 'OFFLINE',
      venueName: 'Centre for Intelligent Systems, IIT Jodhpur Campus',
      city: 'Jodhpur',
      state: 'Rajasthan',
      country: 'India',
      prizePool: 150000,
      prizeCurrency: 'INR',
      registrationStatus: 'CLOSING_SOON',
      registrationOpenDate: new Date('2026-08-05T00:00:00.000Z'),
      registrationDeadline: new Date(Date.now() + 36 * 3600 * 1000), // ~36 hours from now
      eventStartDate: new Date('2026-09-05T03:30:00.000Z'),
      eventEndDate: new Date('2026-09-07T12:30:00.000Z'),
      teamMin: 1,
      teamMax: 4,
      eligibility: 'All Engineering & Polytechnic Students',
      themes: JSON.stringify(['Robotics', 'Web3', 'CleanTech', 'AI']),
      technologies: JSON.stringify(['ROS2', 'Solidity', 'TensorFlow', 'C++', 'Next.js']),
      registrationUrl: 'https://unstop.com/hackathons/deserthacks-2026-iit-jodhpur',
      officialWebsite: 'https://deserthacks.org',
      bannerImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=400&fit=crop',
      sourceName: 'Unstop',
      sourceUrl: 'https://unstop.com/hackathons/deserthacks-2026-iit-jodhpur',
      verified: true,
      verificationStatus: 'VERIFIED',
      verificationNote: 'Confirmed via IIT Jodhpur student committee announcement.',
      sources: {
        create: [
          {
            sourceName: 'Unstop',
            sourceId: 'unstop-deserthacks-2026',
            sourceUrl: 'https://unstop.com/hackathons/deserthacks-2026-iit-jodhpur',
            isCanonical: true,
          },
        ],
      },
    },
  });

  // 3. HackX 2026 (Postponed Event with Change History)
  const hackX = await prisma.hackathon.create({
    data: {
      name: 'HackX 2026',
      slug: 'hackx-2026',
      description: 'Rajasthan’s largest student-driven cybersecurity and deep tech challenge. Now rescheduled to September due to university calendar alignment.',
      organizerName: 'Rajasthan Technical Council',
      mode: 'OFFLINE',
      venueName: 'Rajasthan International Centre (RIC), Jhalana',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      prizePool: 100000,
      prizeCurrency: 'INR',
      registrationStatus: 'POSTPONED',
      isPostponed: true,
      registrationOpenDate: new Date('2026-07-20T00:00:00.000Z'),
      registrationDeadline: new Date('2026-09-02T18:30:00.000Z'),
      eventStartDate: new Date('2026-09-10T04:00:00.000Z'),
      eventEndDate: new Date('2026-09-12T12:00:00.000Z'),
      teamMin: 2,
      teamMax: 4,
      eligibility: 'Undergraduate & Graduate Students',
      themes: JSON.stringify(['Cybersecurity', 'AI', 'FinTech']),
      technologies: JSON.stringify(['Rust', 'Go', 'GCP', 'Kubernetes']),
      registrationUrl: 'https://devfolio.co/hackx-2026',
      officialWebsite: 'https://hackx2026.org',
      bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=400&fit=crop',
      sourceName: 'Devfolio',
      sourceUrl: 'https://devfolio.co/hackx-2026',
      verified: true,
      verificationStatus: 'VERIFIED',
      verificationNote: 'Postponement officially confirmed on organizer twitter and Devfolio.',
      changes: {
        create: [
          {
            field: 'eventStartDate',
            previousValue: '2026-08-24T04:00:00.000Z',
            newValue: '2026-09-10T04:00:00.000Z',
            detectedAt: new Date('2026-08-15T10:00:00Z'),
            source: 'Devfolio',
            notified: true,
          },
          {
            field: 'isPostponed',
            previousValue: 'false',
            newValue: 'true',
            detectedAt: new Date('2026-08-15T10:00:00Z'),
            source: 'Devfolio',
            notified: true,
          },
        ],
      },
    },
  });

  // 4. Bangalore Buildathon 2026 (Bengaluru, Karnataka - Offline, Upcoming)
  await prisma.hackathon.create({
    data: {
      name: 'Bangalore Buildathon 2026',
      slug: 'bangalore-buildathon-2026',
      description: 'Silicon Valley of India hackathon building high-throughput FinTech and Agentic AI workflows with top VC mentors and hiring partners.',
      organizerName: 'Bengaluru Tech Collective',
      organizerWebsite: 'https://blrtechcollective.dev',
      mode: 'OFFLINE',
      venueName: 'Koramangala Indoor Stadium & Convention Center',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      prizePool: 500000,
      prizeCurrency: 'INR',
      registrationStatus: 'UPCOMING',
      registrationOpenDate: new Date('2026-09-01T00:00:00.000Z'),
      registrationDeadline: new Date('2026-09-20T18:30:00.000Z'),
      eventStartDate: new Date('2026-09-26T03:30:00.000Z'),
      eventEndDate: new Date('2026-09-28T12:30:00.000Z'),
      teamMin: 2,
      teamMax: 5,
      eligibility: 'Open to All (Students & Professionals)',
      themes: JSON.stringify(['FinTech', 'AI', 'Open Innovation', 'Web3']),
      technologies: JSON.stringify(['Next.js', 'PostgreSQL', 'LangChain', 'Docker', 'AWS']),
      registrationUrl: 'https://devpost.com/hackathons/bangalore-buildathon-2026',
      officialWebsite: 'https://bangalorebuildathon.com',
      bannerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop',
      sourceName: 'Devpost',
      sourceUrl: 'https://devpost.com/hackathons/bangalore-buildathon-2026',
      verified: true,
      verificationStatus: 'VERIFIED',
      verificationNote: 'Official partner event on Devpost.',
    },
  });

  // 5. Global Agentic AI Hackathon 2026 (Global - Online, MLH)
  await prisma.hackathon.create({
    data: {
      name: 'Global Agentic AI Hackathon 2026',
      slug: 'global-agentic-ai-hackathon-2026',
      description: '48-hour global online hackathon to build autonomous multi-agent systems, tool-calling agents, and real-world developer tooling.',
      organizerName: 'Major League Hacking (MLH)',
      organizerWebsite: 'https://mlh.io',
      mode: 'ONLINE',
      city: 'Global',
      country: 'Global',
      prizePool: 1200000,
      prizeCurrency: 'INR',
      registrationStatus: 'OPEN',
      registrationOpenDate: new Date('2026-08-10T00:00:00.000Z'),
      registrationDeadline: new Date('2026-09-12T18:30:00.000Z'),
      eventStartDate: new Date('2026-09-15T00:00:00.000Z'),
      eventEndDate: new Date('2026-09-17T23:59:00.000Z'),
      teamMin: 1,
      teamMax: 4,
      eligibility: 'Open to everyone worldwide',
      themes: JSON.stringify(['AI', 'Open Innovation', 'HealthTech', 'Developer Tools']),
      technologies: JSON.stringify(['TypeScript', 'Python', 'Gemini API', 'Claude API', 'OpenAI', 'Vector DB']),
      registrationUrl: 'https://mlh.io/seasons/2026/events/agentic-ai',
      officialWebsite: 'https://agenticaihack.dev',
      bannerImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=400&fit=crop',
      sourceName: 'MLH',
      sourceUrl: 'https://mlh.io/seasons/2026/events/agentic-ai',
      verified: true,
      verificationStatus: 'VERIFIED',
    },
  });

  // 6. Delhi AI & Cyber Nexus 2026 (New Delhi - Hybrid, Open)
  await prisma.hackathon.create({
    data: {
      name: 'Delhi AI & Cyber Nexus 2026',
      slug: 'delhi-ai-cyber-nexus-2026',
      description: 'Cross-disciplinary hybrid hackathon bringing together defensive security researchers and machine learning practitioners.',
      organizerName: 'Delhi Technical University & CyberPeace',
      mode: 'HYBRID',
      venueName: 'BR Ambedkar Auditorium, DTU Campus',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      prizePool: 300000,
      prizeCurrency: 'INR',
      registrationStatus: 'OPEN',
      registrationOpenDate: new Date('2026-08-01T00:00:00.000Z'),
      registrationDeadline: new Date('2026-08-30T18:30:00.000Z'),
      eventStartDate: new Date('2026-09-04T04:00:00.000Z'),
      eventEndDate: new Date('2026-09-06T12:00:00.000Z'),
      teamMin: 2,
      teamMax: 4,
      eligibility: 'University Students & Research Scholars',
      themes: JSON.stringify(['Cybersecurity', 'AI', 'FinTech']),
      technologies: JSON.stringify(['Wireshark', 'Python', 'Suricata', 'FastAPI']),
      registrationUrl: 'https://unstop.com/hackathons/delhi-ai-cyber-nexus-2026',
      officialWebsite: 'https://cybernexus.dtu.ac.in',
      bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=400&fit=crop',
      sourceName: 'Unstop',
      sourceUrl: 'https://unstop.com/hackathons/delhi-ai-cyber-nexus-2026',
      verified: true,
      verificationStatus: 'VERIFIED',
    },
  });

  // 7. Unverified / Partial Hackathon to demonstrate "Never Invent Information" principle
  await prisma.hackathon.create({
    data: {
      name: 'Udaipur Smart Mobility Sprint',
      slug: 'udaipur-smart-mobility-sprint',
      description: 'A grassroots civic tech hackathon focused on sustainable electric mobility and public transit optimization in heritage cities.',
      organizerName: 'Smart City Udaipur Initiative',
      mode: 'OFFLINE',
      venueName: null, // Unknown venue -> "Location not confirmed"
      city: 'Udaipur',
      state: 'Rajasthan',
      country: 'India',
      prizePool: null, // Unknown prize -> "Prize pool not announced"
      prizeCurrency: 'INR',
      registrationStatus: 'OPEN',
      registrationOpenDate: new Date('2026-08-12T00:00:00Z'),
      registrationDeadline: new Date('2026-09-15T18:30:00Z'),
      eventStartDate: new Date('2026-09-22T04:00:00Z'),
      eventEndDate: new Date('2026-09-23T12:00:00Z'),
      teamMin: 1,
      teamMax: 3,
      eligibility: 'Open to all residents & students in Rajasthan',
      themes: JSON.stringify(['IoT', 'Open Innovation', 'Robotics']),
      technologies: JSON.stringify(['C++', 'OpenStreetMap', 'Python']),
      registrationUrl: 'https://udaipursmartcity.gov.in/hackathon',
      sourceName: 'University Portal',
      sourceUrl: 'https://udaipursmartcity.gov.in/hackathon',
      verified: false,
      verificationStatus: 'PARTIALLY_VERIFIED',
      verificationNote: 'Organizer identity confirmed; prize pool and final venue pending official release.',
    },
  });

  // 8. EthIndia Nexus 2026 (Bengaluru, Karnataka - Hybrid, Web3)
  await prisma.hackathon.create({
    data: {
      name: 'EthIndia Nexus 2026',
      slug: 'ethindia-nexus-2026',
      description: 'Asia’s biggest Web3 and decentralized architecture hackathon. Build on Ethereum Layer 2s, zero-knowledge rollups, and decentralized compute networks.',
      organizerName: 'Devfolio & ETHGlobal',
      mode: 'HYBRID',
      venueName: 'KTPO Whitefield Convention Center',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      prizePool: 1000000,
      prizeCurrency: 'INR',
      registrationStatus: 'OPEN',
      registrationOpenDate: new Date('2026-08-01T00:00:00Z'),
      registrationDeadline: new Date('2026-09-08T18:30:00Z'),
      eventStartDate: new Date('2026-09-18T04:00:00Z'),
      eventEndDate: new Date('2026-09-20T12:00:00Z'),
      teamMin: 1,
      teamMax: 4,
      eligibility: 'Open to all Web3 builders',
      themes: JSON.stringify(['Web3', 'FinTech', 'Open Innovation', 'Cybersecurity']),
      technologies: JSON.stringify(['Solidity', 'Rust', 'Foundry', 'Ethers.js', 'Next.js']),
      registrationUrl: 'https://ethindia2026.devfolio.co',
      officialWebsite: 'https://ethindia.co',
      bannerImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=400&fit=crop',
      sourceName: 'Devfolio',
      sourceUrl: 'https://ethindia2026.devfolio.co',
      verified: true,
      verificationStatus: 'VERIFIED',
    },
  });

  // 9. Past / Closed Hackathon
  await prisma.hackathon.create({
    data: {
      name: 'Summer CodeSprint 2026',
      slug: 'summer-codesprint-2026',
      description: 'A 24-hour rapid prototyping hackathon held during summer break for early college students.',
      organizerName: 'Open Source Community India',
      mode: 'ONLINE',
      city: 'Global',
      country: 'India',
      prizePool: 50000,
      prizeCurrency: 'INR',
      registrationStatus: 'CLOSED',
      registrationOpenDate: new Date('2026-06-01T00:00:00Z'),
      registrationDeadline: new Date('2026-07-01T18:30:00Z'),
      eventStartDate: new Date('2026-07-05T04:00:00Z'),
      eventEndDate: new Date('2026-07-06T04:00:00Z'),
      teamMin: 1,
      teamMax: 3,
      eligibility: 'First & Second Year Students',
      themes: JSON.stringify(['Open Innovation', 'Web']),
      technologies: JSON.stringify(['JavaScript', 'HTML/CSS', 'Node.js']),
      registrationUrl: 'https://unstop.com/hackathons/summer-codesprint-2026',
      sourceName: 'Unstop',
      sourceUrl: 'https://unstop.com/hackathons/summer-codesprint-2026',
      verified: true,
      verificationStatus: 'VERIFIED',
    },
  });

  console.log('🌱 Creating initial crawler run record...');
  const run = await prisma.crawlerRun.create({
    data: {
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 5 * 3600 * 1000),
      completedAt: new Date(Date.now() - 5 * 3600 * 1000 + 42000),
      eventsDiscovered: 48,
      eventsCreated: 9,
      eventsUpdated: 2,
      duplicateCount: 14,
      errorCount: 0,
      durationMs: 42000,
      sourceRuns: {
        create: [
          {
            sourceName: 'Devfolio',
            status: 'SUCCESS',
            eventsFound: 18,
            responseTimeMs: 820,
          },
          {
            sourceName: 'Unstop',
            status: 'SUCCESS',
            eventsFound: 15,
            responseTimeMs: 1140,
          },
          {
            sourceName: 'Devpost',
            status: 'SUCCESS',
            eventsFound: 8,
            responseTimeMs: 950,
          },
          {
            sourceName: 'MLH',
            status: 'SUCCESS',
            eventsFound: 5,
            responseTimeMs: 630,
          },
          {
            sourceName: 'University Feeds',
            status: 'SUCCESS',
            eventsFound: 2,
            responseTimeMs: 1420,
          },
        ],
      },
    },
  });

  console.log('🌱 Creating sample Audit Logs...');
  await prisma.adminAuditLog.create({
    data: {
      action: 'SYSTEM_BOOTSTRAP',
      entityType: 'System',
      entityId: 'root',
      performedBy: 'SYSTEM',
      details: JSON.stringify({ message: 'HackRadar database initialized with seed dataset.' }),
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
