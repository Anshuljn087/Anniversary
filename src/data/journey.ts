export type ChapterImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type Chapter = {
  id: string;
  index: number;
  kicker: string;
  title: string;
  dateLabel: string;
  body: string[];
  images: ChapterImage[];
  interaction?: "headlights" | "dimmer" | "foggyGlass" | "finale";
};

export const journey: Chapter[] = [
  {
    id: "cafe-dates",
    index: 1,
    kicker: "Chapter One",
    title: "The Initial Café Dates",
    dateLabel: "Where it began",
    body: [
      "Two coffees, one small table, and conversation that refused to end. Every café became a little warmer the moment you walked in.",
      "Shy smiles across the table, hands that took their time to finally hold each other — the first chapter, written slowly, on purpose.",
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1600&auto=format&fit=crop",
        alt: "Two coffee cups on a café table",
      },
    ],
  },
  {
    id: "pre-wedding-getaways",
    index: 2,
    kicker: "Chapter Two",
    title: "Three Getaways, Before 'I Do'",
    dateLabel: "Samskara · Achrol Niwas · Royal Orchid",
    body: [
      "Before the vows, there were the rehearsals of forever — three escapes where we learned how easily we fit into each other's days.",
      "Samskara Resort's quiet mornings, the royal stillness of Achrol Niwas, the golden light of Royal Orchid — each one a page in the same story.",
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400&auto=format&fit=crop",
        alt: "Luxury resort pool at golden hour",
        caption: "Samskara Resort",
      },
      {
        src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1400&auto=format&fit=crop",
        alt: "Heritage palace courtyard",
        caption: "Achrol Niwas",
      },
      {
        src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1400&auto=format&fit=crop",
        alt: "Elegant resort villa at dusk",
        caption: "Royal Orchid",
      },
    ],
  },
  {
    id: "night-drives",
    index: 3,
    kicker: "Chapter Three",
    title: "Long Car Drives",
    dateLabel: "Music, and the city at night",
    body: [
      "Windows down, a playlist that knew us better than we knew ourselves, and the city lights blurring past like they were in on the secret too.",
      "Some of our best conversations happened at sixty kilometres an hour, going nowhere in particular — which was exactly the point.",
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600&auto=format&fit=crop",
        alt: "Night highway with light trails",
      },
    ],
    interaction: "headlights",
  },
  {
    id: "sagai-shaadi",
    index: 4,
    kicker: "Chapter Four",
    title: "Sagai & Shaadi",
    dateLabel: "The promise, made official",
    body: [
      "A ring, a room full of the people who love us most, and a promise we'd already been keeping quietly for years.",
      "Then the wedding — mantras, laughter, seven steps, and a lifetime that officially began counting from that day.",
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400&auto=format&fit=crop",
        alt: "Wedding rings close up",
        caption: "Sagai",
      },
      {
        src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1400&auto=format&fit=crop",
        alt: "Wedding ceremony decor",
        caption: "Shaadi",
      },
    ],
  },
  {
    id: "golden-night",
    index: 5,
    kicker: "Chapter Five",
    title: "The Golden Night",
    dateLabel: "Our first night, together",
    body: [
      "The world outside went quiet. It was just candlelight, your hand in mine, and the strange, lovely disbelief that this was now our forever.",
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1600&auto=format&fit=crop",
        alt: "Warm candlelight in a hotel room",
      },
    ],
    interaction: "dimmer",
  },
  {
    id: "thailand-honeymoon",
    index: 6,
    kicker: "Chapter Six",
    title: "Thailand Honeymoon",
    dateLabel: "Turquoise water, endless horizon",
    body: [
      "Our first trip as husband and wife — tropical air, impossibly blue water, and nothing on the agenda except each other.",
      "We came home sun-kissed, salt-haired, and even more sure that we'd chosen right.",
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1600&auto=format&fit=crop",
        alt: "Turquoise tropical beach in Thailand",
      },
    ],
  },
  {
    id: "travel-odyssey",
    index: 7,
    kicker: "Chapter Seven",
    title: "The Travel Odyssey",
    dateLabel: "Kolkata · Goa · Kundalpur",
    body: [
      "Kolkata's old-world charm, Goa's sunsets that refused to be ordinary, and Kundalpur's quiet, spiritual stillness — we collected places the way other people collect memories, because for us they were the same thing.",
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=1400&auto=format&fit=crop",
        alt: "Kolkata heritage architecture",
        caption: "Kolkata",
      },
      {
        src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f3?q=80&w=1400&auto=format&fit=crop",
        alt: "Goa sunset over the sea",
        caption: "Goa",
      },
      {
        src: "https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=1400&auto=format&fit=crop",
        alt: "Serene temple grounds",
        caption: "Kundalpur",
      },
    ],
  },
  {
    id: "room-warmth",
    index: 8,
    kicker: "Chapter Eight",
    title: "Everyday Room Warmth",
    dateLabel: "The ordinary days, kept",
    body: [
      "No occasion, no destination — just a lazy Sunday, tangled blankets, and the quiet luxury of doing nothing together.",
      "These are the memories no camera ever really captures. Wipe the glass — this one's just for us.",
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1489171078254-c3365d6e359f?q=80&w=1600&auto=format&fit=crop",
        alt: "Cozy warm bedroom morning light",
      },
    ],
    interaction: "foggyGlass",
  },
  {
    id: "special-memories",
    index: 9,
    kicker: "Chapter Nine",
    title: "Special Memories",
    dateLabel: "26th March, and every day in between",
    body: [
      "Your birthday, candles and all, was just one bright line in a year full of small, specific joys — inside jokes, silly fights that didn't matter by dinner, and a hundred tiny proofs that we'd built something good.",
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?q=80&w=1600&auto=format&fit=crop",
        alt: "Birthday cake with candlelight",
      },
    ],
  },
  {
    id: "grand-finale",
    index: 10,
    kicker: "Chapter Ten · 8th October",
    title: "Two Years of Us",
    dateLabel: "The Grand Finale",
    body: [
      "Two candles. One wish we don't even need to say out loud, because we're already living it.",
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1602874801006-39634ba6a4f0?q=80&w=1600&auto=format&fit=crop",
        alt: "Two glowing anniversary candles on a cake",
      },
    ],
    interaction: "finale",
  },
];

export const loveLetter = `My love,

Two years ago today, I didn't just gain a wife — I gained my favourite person, my safest place, and my best story. Every chapter above is ours, but the one I'm most excited for is the one we haven't lived yet.

Thank you for every café, every car ride, every quiet Sunday, and every "I do" you keep choosing, again and again.

Here's to forever — one ordinary, extraordinary day at a time.

Always yours.`;
