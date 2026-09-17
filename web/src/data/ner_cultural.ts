export interface CulturalItem {
  id: string;
  name: string;
  assameseName?: string;
  state: string;
  category: 'food' | 'clothing' | 'object' | 'flora' | 'festival' | 'instrument';
  description: string;
  imageUrl: string;
}

export const NER_CULTURAL_DATABASE: CulturalItem[] = [
  {
    id: 'gamusa',
    name: 'Assamese Gamusa',
    assameseName: 'গামোচা',
    state: 'Assam',
    category: 'clothing',
    description: 'Traditional white and red handwoven cotton scarf symbol of respect and warmth.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500'
  },
  {
    id: 'bhoot_jolokia',
    name: 'Bhoot Jolokia (Ghost Pepper)',
    assameseName: 'ভূত জলকীয়াই',
    state: 'Assam',
    category: 'food',
    description: 'World famous chili pepper indigenous to Assam and Nagaland.',
    imageUrl: 'https://images.unsplash.com/photo-1588625500858-a832f0590899?w=500'
  },
  {
    id: 'kazi_nemu',
    name: 'Kazi Nemu (Assam Lemon)',
    assameseName: 'কাজী টেঙা',
    state: 'Assam',
    category: 'flora',
    description: 'Distinctive fragrant elongated lemon cultivated in Assam.',
    imageUrl: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=500'
  },
  {
    id: 'pepa',
    name: 'Pepa (Hornpipe Instrument)',
    assameseName: 'পেপা',
    state: 'Assam',
    category: 'instrument',
    description: 'Traditional Bihu wind musical instrument crafted from buffalo horn.',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500'
  },
  {
    id: 'drap_shawl',
    name: 'Naga Handloom Shawl',
    state: 'Nagaland',
    category: 'clothing',
    description: 'Vibrant patterned hand-woven shawl representing Naga cultural heritage.',
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=500'
  },
  {
    id: 'bamboo_dance_pole',
    name: 'Cheraw Bamboo Instrument',
    state: 'Mizoram',
    category: 'instrument',
    description: 'Rhythmic bamboo poles used in Mizoram Cheraw folk dance.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500'
  },
  {
    id: 'rhododendron',
    name: 'Rhododendron Flower',
    state: 'Sikkim',
    category: 'flora',
    description: 'State flower of Sikkim blooming in vibrant crimson hues across alpine ridges.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500'
  },
  {
    id: 'khasi_basket',
    name: 'Khasi Bamboo Basket (Khoh)',
    state: 'Meghalaya',
    category: 'object',
    description: 'Conical woven bamboo carrying basket crafted by Meghalaya Khasi artisans.',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=500'
  }
];
