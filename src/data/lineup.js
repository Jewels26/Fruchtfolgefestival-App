// ─── LINEUP DATA — echte Banddaten vom Festival ───
// Bandfotos: public/bands/bandname.jpg (Querformat, mind. 800x400px)
// Solange kein Foto vorhanden: Placeholder wird automatisch angezeigt

export const LINEUP = {
  FRI: [
    {
      id: 'dessert-oracle',
      name: 'Dessert Oracle',
      time: '16:30',
      genre: 'tbd.',
      origin: null,
      photo: null, // → '/bands/dessert-oracle.jpg' wenn vorhanden
    },
    {
      id: 'powasser-moskau78',
      name: 'Powasser & Moskau78',
      time: '17:30',
      genre: 'Punk',
      origin: 'DE',
      photo: null,
    },
    {
      id: 'akarinde',
      name: 'Akarinde',
      time: '18:45',
      genre: 'Acoustic Punk & Noise',
      origin: 'DE',
      photo: '/bands/Akarinde.webp',
    },
    {
      id: 'einseinsein',
      name: 'EinsEinsEins',
      time: '20:00',
      genre: 'Retro Wave',
      origin: 'DE',
      photo: '/bands/Einseinseins.jpg',
    },
    {
      id: 'heckspoiler',
      name: 'Heckspoiler',
      time: '21:30',
      genre: 'Noise Rock',
      origin: 'AT',
      photo: '/bands/Heckspoiler.jpg',
    },
    {
      id: 'late-night-fri',
      name: 'Late Night Special',
      time: '23:00',
      genre: '???',
      origin: null,
      photo: null,
      secret: true,
    },
  ],
  SAT: [
    {
      id: 'raeckler',
      name: 'Räckler',
      time: '13:30',
      genre: 'Thrashmetal',
      origin: 'DE',
      photo: null,
    },
    {
      id: 'traesh',
      name: 'Träsh',
      time: '14:30',
      genre: 'Träsh-Rock',
      origin: 'DE',
      photo: '/bands/Traesh.jpg',
    },
    {
      id: 'fromage-from-arsch',
      name: 'Fromage from Arsch',
      time: '15:30',
      genre: 'tbd.',
      origin: null,
      photo: null,
    },
    {
      id: 'odysseus',
      name: 'Odysseus',
      time: '16:45',
      genre: 'Heavy Blues Rock',
      origin: 'DE',
      photo: '/bands/Odysseus.jpg',
    },
    {
      id: 'poolhead',
      name: 'Poolhead',
      time: '18:00',
      genre: "Surf'n'Psych Rock",
      origin: 'DE',
      photo: '/bands/Poolhead.jpeg',
    },
    {
      id: 'senorez-cabronez',
      name: 'Senorez Cabronez',
      time: '19:30',
      genre: "Spanish Punk'n'Roll",
      origin: 'SP',
      photo: '/bands/Senorez-cabronez.jpeg',
    },
    {
      id: 'skraeckoedlan',
      name: 'Skraeckoedlan',
      time: '21:15',
      genre: 'Sci-Fi Stoner Rock',
      origin: 'SE',
      photo: '/bands/Skraeckoedlan.jpg',
    },
    {
      id: 'mad-mother',
      name: 'Mad Mother',
      time: '23:15',
      genre: 'Kraut & Kren Rock',
      origin: 'DE/AT',
      photo: '/bands/Mad_Mother.jpg',
      lateNight: true,
    },
  ],
}

export const DAYS = [
  { key: 'FRI', label: 'FRI', date: '28.8.' },
  { key: 'SAT', label: 'SAT', date: '29.8.' },
]
