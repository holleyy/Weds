export interface Nominee {
  id: string;
  name: string;
  film: string;
}

export interface Category {
  id: string;
  name: string;
  nominees: Nominee[];
}

export const categories: Category[] = [
  {
    id: "best-picture",
    name: "Best Picture",
    nominees: [
      { id: "bugonia", name: "Bugonia", film: "Bugonia" },
      { id: "f1", name: "F1", film: "F1" },
      { id: "frankenstein", name: "Frankenstein", film: "Frankenstein" },
      { id: "hamnet", name: "Hamnet", film: "Hamnet" },
      { id: "marty-supreme", name: "Marty Supreme", film: "Marty Supreme" },
      { id: "one-battle", name: "One Battle after Another", film: "One Battle after Another" },
      { id: "secret-agent", name: "The Secret Agent", film: "The Secret Agent" },
      { id: "sentimental-value", name: "Sentimental Value", film: "Sentimental Value" },
      { id: "sinners", name: "Sinners", film: "Sinners" },
      { id: "train-dreams", name: "Train Dreams", film: "Train Dreams" },
    ],
  },
  {
    id: "best-director",
    name: "Best Director",
    nominees: [
      { id: "chloe-zhao", name: "Chloé Zhao", film: "Hamnet" },
      { id: "josh-safdie", name: "Josh Safdie", film: "Marty Supreme" },
      { id: "paul-thomas-anderson", name: "Paul Thomas Anderson", film: "One Battle after Another" },
      { id: "joachim-trier", name: "Joachim Trier", film: "Sentimental Value" },
      { id: "ryan-coogler", name: "Ryan Coogler", film: "Sinners" },
    ],
  },
  {
    id: "best-actor",
    name: "Best Actor",
    nominees: [
      { id: "timothee-chalamet", name: "Timothée Chalamet", film: "Marty Supreme" },
      { id: "leonardo-dicaprio", name: "Leonardo DiCaprio", film: "One Battle after Another" },
      { id: "ethan-hawke", name: "Ethan Hawke", film: "Blue Moon" },
      { id: "michael-b-jordan", name: "Michael B. Jordan", film: "Sinners" },
      { id: "wagner-moura", name: "Wagner Moura", film: "The Secret Agent" },
    ],
  },
  {
    id: "best-actress",
    name: "Best Actress",
    nominees: [
      { id: "jessie-buckley", name: "Jessie Buckley", film: "Hamnet" },
      { id: "rose-byrne", name: "Rose Byrne", film: "If I Had Legs I'd Kick You" },
      { id: "kate-hudson", name: "Kate Hudson", film: "Song Sung Blue" },
      { id: "renate-reinsve", name: "Renate Reinsve", film: "Sentimental Value" },
      { id: "emma-stone", name: "Emma Stone", film: "Bugonia" },
    ],
  },
  {
    id: "best-supporting-actor",
    name: "Best Supporting Actor",
    nominees: [
      { id: "benicio-del-toro", name: "Benicio Del Toro", film: "One Battle after Another" },
      { id: "jacob-elordi", name: "Jacob Elordi", film: "Frankenstein" },
      { id: "delroy-lindo", name: "Delroy Lindo", film: "Sinners" },
      { id: "sean-penn", name: "Sean Penn", film: "One Battle after Another" },
      { id: "stellan-skarsgard", name: "Stellan Skarsgård", film: "Sentimental Value" },
    ],
  },
  {
    id: "best-supporting-actress",
    name: "Best Supporting Actress",
    nominees: [
      { id: "elle-fanning", name: "Elle Fanning", film: "Sentimental Value" },
      { id: "inga-lilleaas", name: "Inga Ibsdotter Lilleaas", film: "Sentimental Value" },
      { id: "amy-madigan", name: "Amy Madigan", film: "Weapons" },
      { id: "wunmi-mosaku", name: "Wunmi Mosaku", film: "Sinners" },
      { id: "teyana-taylor", name: "Teyana Taylor", film: "One Battle after Another" },
    ],
  },
  {
    id: "best-original-screenplay",
    name: "Best Original Screenplay",
    nominees: [
      { id: "blue-moon-script", name: "Robert Kaplow", film: "Blue Moon" },
      { id: "accident-script", name: "Jafar Panahi", film: "It Was Just an Accident" },
      { id: "marty-supreme-script", name: "Ronald Bronstein & Josh Safdie", film: "Marty Supreme" },
      { id: "sentimental-value-script", name: "Eskil Vogt & Joachim Trier", film: "Sentimental Value" },
      { id: "sinners-script", name: "Ryan Coogler", film: "Sinners" },
    ],
  },
  {
    id: "best-adapted-screenplay",
    name: "Best Adapted Screenplay",
    nominees: [
      { id: "bugonia-script", name: "Will Tracy", film: "Bugonia" },
      { id: "frankenstein-script", name: "Guillermo del Toro", film: "Frankenstein" },
      { id: "hamnet-script", name: "Chloé Zhao & Maggie O'Farrell", film: "Hamnet" },
      { id: "one-battle-script", name: "Paul Thomas Anderson", film: "One Battle after Another" },
      { id: "train-dreams-script", name: "Clint Bentley & Greg Kwedar", film: "Train Dreams" },
    ],
  },
  {
    id: "best-animated-feature",
    name: "Best Animated Feature Film",
    nominees: [
      { id: "arco", name: "Arco", film: "Arco" },
      { id: "elio", name: "Elio", film: "Elio" },
      { id: "kpop-demon", name: "KPop Demon Hunters", film: "KPop Demon Hunters" },
      { id: "little-amelie", name: "Little Amélie or the Character of Rain", film: "Little Amélie or the Character of Rain" },
      { id: "zootopia-2", name: "Zootopia 2", film: "Zootopia 2" },
    ],
  },
  {
    id: "best-cinematography",
    name: "Best Cinematography",
    nominees: [
      { id: "frankenstein-cinematography", name: "Dan Laustsen", film: "Frankenstein" },
      { id: "marty-supreme-cinematography", name: "Darius Khondji", film: "Marty Supreme" },
      { id: "one-battle-cinematography", name: "Michael Bauman", film: "One Battle after Another" },
      { id: "sinners-cinematography", name: "Autumn Durald Arkapaw", film: "Sinners" },
      { id: "train-dreams-cinematography", name: "Adolpho Veloso", film: "Train Dreams" },
    ],
  },
  {
    id: "best-costume-design",
    name: "Best Costume Design",
    nominees: [
      { id: "avatar-costume", name: "Deborah L. Scott", film: "Avatar: Fire and Ash" },
      { id: "frankenstein-costume", name: "Kate Hawley", film: "Frankenstein" },
      { id: "hamnet-costume", name: "Malgosia Turzanska", film: "Hamnet" },
      { id: "marty-supreme-costume", name: "Miyako Bellizzi", film: "Marty Supreme" },
      { id: "sinners-costume", name: "Ruth E. Carter", film: "Sinners" },
    ],
  },
  {
    id: "best-film-editing",
    name: "Best Film Editing",
    nominees: [
      { id: "f1-editing", name: "Stephen Mirrione", film: "F1" },
      { id: "marty-supreme-editing", name: "Ronald Bronstein & Josh Safdie", film: "Marty Supreme" },
      { id: "one-battle-editing", name: "Andy Jurgensen", film: "One Battle after Another" },
      { id: "sentimental-value-editing", name: "Olivier Bugge Coutté", film: "Sentimental Value" },
      { id: "sinners-editing", name: "Michael P. Shawver", film: "Sinners" },
    ],
  },
  {
    id: "best-makeup-hairstyling",
    name: "Best Makeup and Hairstyling",
    nominees: [
      { id: "frankenstein-makeup", name: "Mike Hill, Jordan Samuel & Cliona Furey", film: "Frankenstein" },
      { id: "kokuho-makeup", name: "Kyoko Toyokawa, Naomi Hibino & Tadashi Nishimatsu", film: "Kokuho" },
      { id: "sinners-makeup", name: "Ken Diaz, Mike Fontaine & Shunika Terry", film: "Sinners" },
      { id: "smashing-machine-makeup", name: "Kazu Hiro, Glen Griffin & Bjoern Rehbein", film: "The Smashing Machine" },
      { id: "ugly-stepsister-makeup", name: "Thomas Foldberg & Anne Cathrine Sauerberg", film: "The Ugly Stepsister" },
    ],
  },
  {
    id: "best-original-score",
    name: "Best Original Score",
    nominees: [
      { id: "bugonia-score", name: "Jerskin Fendrix", film: "Bugonia" },
      { id: "frankenstein-score", name: "Alexandre Desplat", film: "Frankenstein" },
      { id: "hamnet-score", name: "Max Richter", film: "Hamnet" },
      { id: "one-battle-score", name: "Jonny Greenwood", film: "One Battle after Another" },
      { id: "sinners-score", name: "Ludwig Goransson", film: "Sinners" },
    ],
  },
  {
    id: "best-original-song",
    name: "Best Original Song",
    nominees: [
      { id: "dear-me", name: "\"Dear Me\" from Diane Warren: Relentless", film: "Diane Warren: Relentless" },
      { id: "golden", name: "\"Golden\" from KPop Demon Hunters", film: "KPop Demon Hunters" },
      { id: "i-lied", name: "\"I Lied To You\" from Sinners", film: "Sinners" },
      { id: "sweet-dreams", name: "\"Sweet Dreams Of Joy\" from Viva Verdi!", film: "Viva Verdi!" },
      { id: "train-dreams-song", name: "\"Train Dreams\" from Train Dreams", film: "Train Dreams" },
    ],
  },
  {
    id: "best-production-design",
    name: "Best Production Design",
    nominees: [
      { id: "frankenstein-production", name: "Tamara Deverell & Shane Vieau", film: "Frankenstein" },
      { id: "hamnet-production", name: "Fiona Crombie & Alice Felton", film: "Hamnet" },
      { id: "marty-supreme-production", name: "Jack Fisk & Adam Willis", film: "Marty Supreme" },
      { id: "one-battle-production", name: "Florencia Martin & Anthony Carlino", film: "One Battle after Another" },
      { id: "sinners-production", name: "Hannah Beachler & Monique Champagne", film: "Sinners" },
    ],
  },
  {
    id: "best-sound",
    name: "Best Sound",
    nominees: [
      { id: "f1-sound", name: "F1", film: "F1" },
      { id: "frankenstein-sound", name: "Frankenstein", film: "Frankenstein" },
      { id: "one-battle-sound", name: "One Battle after Another", film: "One Battle after Another" },
      { id: "sinners-sound", name: "Sinners", film: "Sinners" },
      { id: "sirat-sound", name: "Sirāt", film: "Sirāt" },
    ],
  },
  {
    id: "best-visual-effects",
    name: "Best Visual Effects",
    nominees: [
      { id: "avatar-vfx", name: "Avatar: Fire and Ash", film: "Avatar: Fire and Ash" },
      { id: "f1-vfx", name: "F1", film: "F1" },
      { id: "jurassic-vfx", name: "Jurassic World Rebirth", film: "Jurassic World Rebirth" },
      { id: "lost-bus-vfx", name: "The Lost Bus", film: "The Lost Bus" },
      { id: "sinners-vfx", name: "Sinners", film: "Sinners" },
    ],
  },
  {
    id: "best-international-feature",
    name: "Best International Feature Film",
    nominees: [
      { id: "secret-agent-intl", name: "The Secret Agent", film: "The Secret Agent (Brazil)" },
      { id: "accident-intl", name: "It Was Just an Accident", film: "It Was Just an Accident (France)" },
      { id: "sentimental-value-intl", name: "Sentimental Value", film: "Sentimental Value (Norway)" },
      { id: "sirat-intl", name: "Sirāt", film: "Sirāt (Spain)" },
      { id: "voice-hind-intl", name: "The Voice of Hind Rajab", film: "The Voice of Hind Rajab (Tunisia)" },
    ],
  },
  {
    id: "best-documentary-feature",
    name: "Best Documentary Feature Film",
    nominees: [
      { id: "alabama-solution", name: "The Alabama Solution", film: "The Alabama Solution" },
      { id: "come-see-me", name: "Come See Me in the Good Light", film: "Come See Me in the Good Light" },
      { id: "cutting-rocks", name: "Cutting through Rocks", film: "Cutting through Rocks" },
      { id: "mr-nobody", name: "Mr. Nobody against Putin", film: "Mr. Nobody against Putin" },
      { id: "perfect-neighbor", name: "The Perfect Neighbor", film: "The Perfect Neighbor" },
    ],
  },
];
