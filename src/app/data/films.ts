export interface Film {
  id: string;
  title: string;
  imdbId?: string;
}

// Extract all unique films from nominations
export const films: Film[] = [
  // Best Picture & Drama nominees
  { id: "bugonia", title: "Bugonia", imdbId: "tt12300742" },
  { id: "f1", title: "F1", imdbId: "tt16311594" },
  { id: "frankenstein", title: "Frankenstein", imdbId: "tt1312221" },
  { id: "hamnet", title: "Hamnet", imdbId: "tt14905854" },
  { id: "marty-supreme", title: "Marty Supreme", imdbId: "tt32916440" },
  { id: "one-battle-after-another", title: "One Battle after Another", imdbId: "tt30144839" },
  { id: "the-secret-agent", title: "The Secret Agent", imdbId: "tt27847051" },
  { id: "sentimental-value", title: "Sentimental Value", imdbId: "tt27714581" },
  { id: "sinners", title: "Sinners", imdbId: "tt31193180" },
  { id: "train-dreams", title: "Train Dreams", imdbId: "tt29768334" },
  
  // Additional narrative films
  { id: "blue-moon", title: "Blue Moon", imdbId: "tt32536315" },
  { id: "if-i-had-legs-i-d-kick-you", title: "If I Had Legs I'd Kick You", imdbId: "tt18382850" },
  { id: "it-was-just-an-accident", title: "It Was Just an Accident", imdbId: "tt36491653" },
  { id: "song-sung-blue", title: "Song Sung Blue", imdbId: "tt30343021" },
  { id: "weapons", title: "Weapons", imdbId: "tt26581740" },
  
  // Visual effects & blockbusters
  { id: "avatar-fire-and-ash", title: "Avatar: Fire and Ash", imdbId: "tt1757678" },
  { id: "jurassic-world-rebirth", title: "Jurassic World Rebirth", imdbId: "tt31036941" },
  { id: "the-lost-bus", title: "The Lost Bus", imdbId: "tt21103218" },
  
  // Makeup & technical films
  { id: "kokuho", title: "Kokuho", imdbId: "tt35231039" },
  { id: "the-smashing-machine", title: "The Smashing Machine", imdbId: "tt11214558" },
  { id: "the-ugly-stepsister", title: "The Ugly Stepsister", imdbId: "tt29344903" },
  
  // Sound nominee
  { id: "sirat", title: "Sirāt", imdbId: "tt32298285" },
  
  // International-only films (films not nominated elsewhere)
  { id: "the-voice-of-hind-rajab", title: "The Voice of Hind Rajab", imdbId: "tt36943034" },
  
  // Animated films
  { id: "arco", title: "Arco", imdbId: "tt14883538" },
  { id: "elio", title: "Elio", imdbId: "tt4900148" },
  { id: "kpop-demon-hunters", title: "KPop Demon Hunters", imdbId: "tt14205554" },
  { id: "little-amelie-or-the-character-of-rain", title: "Little Amélie or the Character of Rain", imdbId: "tt29313285" },
  { id: "zootopia-2", title: "Zootopia 2", imdbId: "tt26443597" },
  
  // Original song films
  { id: "diane-warren-relentless", title: "Diane Warren: Relentless", imdbId: "tt14588692" },
  { id: "viva-verdi", title: "Viva Verdi!", imdbId: "tt3595454" },
  
  // Documentary films
  { id: "the-alabama-solution", title: "The Alabama Solution", imdbId: "tt35307139" },
  { id: "come-see-me-in-the-good-light", title: "Come See Me in the Good Light", imdbId: "tt34966013" },
  { id: "cutting-through-rocks", title: "Cutting through Rocks", imdbId: "tt10196414" },
  { id: "mr-nobody-against-putin", title: "Mr. Nobody against Putin", imdbId: "tt34965515" },
  { id: "the-perfect-neighbor", title: "The Perfect Neighbor", imdbId: "tt34962891" },
];