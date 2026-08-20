import { FilterOptions, NaturalSearchResult } from '@/types';

export async function interpretNaturalSearchQuery(query: string): Promise<NaturalSearchResult> {
  const q = query.toLowerCase().trim();
  const filters: FilterOptions = {};
  const explanationParts: string[] = [];

  // 1. Mode detection
  if (q.includes('offline') || q.includes('in-person') || q.includes('on-site') || q.includes('onsite')) {
    filters.mode = 'OFFLINE';
    explanationParts.push('Format: In-person (Offline)');
  } else if (q.includes('online') || q.includes('virtual') || q.includes('remote')) {
    filters.mode = 'ONLINE';
    explanationParts.push('Format: Virtual (Online)');
  } else if (q.includes('hybrid')) {
    filters.mode = 'HYBRID';
    explanationParts.push('Format: Hybrid');
  }

  // 2. City / State detection (India & global hubs)
  const cities = ['jaipur', 'jodhpur', 'udaipur', 'bengaluru', 'bangalore', 'delhi', 'mumbai', 'pune', 'hyderabad', 'chennai', 'kolkata'];
  for (const city of cities) {
    if (q.includes(city)) {
      filters.city = city.charAt(0).toUpperCase() + city.slice(1);
      if (city === 'bangalore') filters.city = 'Bengaluru';
      explanationParts.push(`City: ${filters.city}`);
      break;
    }
  }

  const states = ['rajasthan', 'karnataka', 'maharashtra', 'delhi', 'tamil nadu', 'telangana', 'gujarat'];
  for (const state of states) {
    if (q.includes(state)) {
      filters.state = state.charAt(0).toUpperCase() + state.slice(1);
      explanationParts.push(`State: ${filters.state}`);
      break;
    }
  }

  // 3. Theme detection
  const themesList = [
    { key: 'ai', name: 'AI', words: ['ai', 'artificial intelligence', 'ml', 'machine learning', 'agentic', 'llm', 'deep learning'] },
    { key: 'iot', name: 'IoT', words: ['iot', 'internet of things', 'hardware', 'embedded', 'raspberry', 'arduino', 'esp32'] },
    { key: 'web3', name: 'Web3', words: ['web3', 'blockchain', 'crypto', 'ethereum', 'solidity', 'defi'] },
    { key: 'cybersecurity', name: 'Cybersecurity', words: ['cyber', 'cybersecurity', 'security', 'hacking', 'infosec'] },
    { key: 'fintech', name: 'FinTech', words: ['fintech', 'finance', 'banking', 'payments'] },
    { key: 'robotics', name: 'Robotics', words: ['robotics', 'robots', 'ros', 'automation'] },
    { key: 'healthtech', name: 'HealthTech', words: ['health', 'healthtech', 'medical', 'biotech'] },
    { key: 'open-innovation', name: 'Open Innovation', words: ['open innovation', 'general', 'all tracks'] },
  ];

  const matchedThemes: string[] = [];
  for (const themeItem of themesList) {
    if (themeItem.words.some((w) => new RegExp(`\\b${w}\\b`, 'i').test(q))) {
      matchedThemes.push(themeItem.name);
    }
  }
  if (matchedThemes.length > 0) {
    filters.themes = matchedThemes;
    explanationParts.push(`Tracks: ${matchedThemes.join(', ')}`);
  }

  // 4. Status detection
  if (q.includes('open') || q.includes('registering') || q.includes('live')) {
    filters.status = 'OPEN';
    explanationParts.push('Registration: Open');
  } else if (q.includes('closing soon') || q.includes('ending soon') || q.includes('last day') || q.includes('deadline')) {
    filters.status = 'CLOSING_SOON';
    explanationParts.push('Registration: Closing Soon');
  } else if (q.includes('upcoming') || q.includes('next month')) {
    filters.status = 'UPCOMING';
    explanationParts.push('Registration: Upcoming');
  }

  // 5. Prize detection (e.g. prize > 50000, 1 lakh, 2 lakh, 50k)
  const lakhMatch = q.match(/(\d+)\s*(?:lakh|lakhs|lac|lacs)/);
  const kMatch = q.match(/(\d+)\s*(?:k|thousand)/);
  const numPrizeMatch = q.match(/(?:prize|cash|pool|reward|inr|rs|₹)\s*(?:of|>=|>|minimum|at least)?\s*₹?(\d[\d,]*)/);

  if (lakhMatch) {
    filters.minPrize = parseInt(lakhMatch[1], 10) * 100000;
    explanationParts.push(`Min Prize: ₹${filters.minPrize.toLocaleString('en-IN')}`);
  } else if (kMatch) {
    filters.minPrize = parseInt(kMatch[1], 10) * 1000;
    explanationParts.push(`Min Prize: ₹${filters.minPrize.toLocaleString('en-IN')}`);
  } else if (numPrizeMatch) {
    const rawVal = parseInt(numPrizeMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(rawVal) && rawVal > 0) {
      filters.minPrize = rawVal;
      explanationParts.push(`Min Prize: ₹${rawVal.toLocaleString('en-IN')}`);
    }
  }

  // 6. Student-only detection
  if (q.includes('student') || q.includes('college') || q.includes('university') || q.includes('campus')) {
    filters.studentOnly = true;
    explanationParts.push('Eligibility: Students & Colleges');
  }

  const explanation =
    explanationParts.length > 0
      ? `Filters applied: ${explanationParts.join(' • ')}`
      : 'Showing upcoming hackathons matching all active tracks.';

  return {
    query,
    interpretedFilters: filters,
    explanation,
  };
}
