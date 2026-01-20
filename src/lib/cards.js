// Card data and deck utilities

export const cardTypes = {
  SINGLE_RESPONSE: 'single-response',
  BOTH_RESPONSE: 'both-response',
};

export const cardCategories = {
  PERSONAL: 'personal',
  CREATIVE: 'creative',
  PHILOSOPHICAL: 'philosophical',
  FUN: 'fun',
  DEEP: 'deep',
};

// Array of card prompts
export const cardDeck = [
  // Single-response cards (other player responds)
  { id: 1, prompt: "Tell a story about your most memorable childhood adventure.", type: cardTypes.SINGLE_RESPONSE, category: cardCategories.PERSONAL },
  { id: 2, prompt: "Describe your ideal day from sunrise to sunset.", type: cardTypes.SINGLE_RESPONSE, category: cardCategories.PERSONAL },
  { id: 3, prompt: "What's a skill you've always wanted to learn and why?", type: cardTypes.SINGLE_RESPONSE, category: cardCategories.CREATIVE },
  { id: 4, prompt: "Share a moment that changed your perspective on life.", type: cardTypes.SINGLE_RESPONSE, category: cardCategories.DEEP },
  { id: 5, prompt: "If you could have dinner with any historical figure, who would it be and what would you ask?", type: cardTypes.SINGLE_RESPONSE, category: cardCategories.PHILOSOPHICAL },
  { id: 6, prompt: "Describe a place you've never been but dream of visiting.", type: cardTypes.SINGLE_RESPONSE },
  { id: 7, prompt: "What's something you're grateful for that others might take for granted?", type: cardTypes.SINGLE_RESPONSE },
  { id: 8, prompt: "Tell about a time you stepped outside your comfort zone.", type: cardTypes.SINGLE_RESPONSE },
  { id: 9, prompt: "What's a book, movie, or song that deeply impacted you?", type: cardTypes.SINGLE_RESPONSE },
  { id: 10, prompt: "Describe your perfect weekend getaway.", type: cardTypes.SINGLE_RESPONSE },
  { id: 11, prompt: "What's a piece of advice you'd give to your younger self?", type: cardTypes.SINGLE_RESPONSE },
  { id: 12, prompt: "Share a hobby or interest that brings you joy.", type: cardTypes.SINGLE_RESPONSE },
  { id: 13, prompt: "What's something you've learned recently that surprised you?", type: cardTypes.SINGLE_RESPONSE },
  { id: 14, prompt: "Describe a tradition that's meaningful to you.", type: cardTypes.SINGLE_RESPONSE },
  { id: 15, prompt: "What's a goal you're working towards right now?", type: cardTypes.SINGLE_RESPONSE },
  
  // Both-response cards (both players respond)
  { id: 16, prompt: "Both players: Share your favorite way to unwind after a long day.", type: cardTypes.BOTH_RESPONSE, category: cardCategories.FUN },
  { id: 17, prompt: "Both players: Describe your ideal vacation destination.", type: cardTypes.BOTH_RESPONSE, category: cardCategories.PERSONAL },
  { id: 18, prompt: "Both players: What's a food you could eat every day and never get tired of?", type: cardTypes.BOTH_RESPONSE },
  { id: 19, prompt: "Both players: Share a random act of kindness you've experienced or given.", type: cardTypes.BOTH_RESPONSE },
  { id: 20, prompt: "Both players: What's something that always makes you smile?", type: cardTypes.BOTH_RESPONSE },
  { id: 21, prompt: "Both players: Describe your perfect morning routine.", type: cardTypes.BOTH_RESPONSE },
  { id: 22, prompt: "Both players: What's a quote or saying that resonates with you?", type: cardTypes.BOTH_RESPONSE },
  { id: 23, prompt: "Both players: Share something you're curious about or want to explore.", type: cardTypes.BOTH_RESPONSE },
  { id: 24, prompt: "Both players: What's a small moment of beauty you noticed recently?", type: cardTypes.BOTH_RESPONSE },
  { id: 25, prompt: "Both players: Describe a skill you admire in others.", type: cardTypes.BOTH_RESPONSE },
  { id: 26, prompt: "Both players: What's something you'd love to teach someone else?", type: cardTypes.BOTH_RESPONSE },
  { id: 27, prompt: "Both players: Share a memory that always brings you joy.", type: cardTypes.BOTH_RESPONSE },
  { id: 28, prompt: "Both players: What's a challenge you've overcome that made you stronger?", type: cardTypes.BOTH_RESPONSE },
  { id: 29, prompt: "Both players: Describe something you find inspiring.", type: cardTypes.BOTH_RESPONSE },
  { id: 30, prompt: "Both players: What's something you appreciate about the other player?", type: cardTypes.BOTH_RESPONSE },
];

// Fisher-Yates shuffle algorithm
export function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Initialize a shuffled deck
export function createShuffledDeck(selectedCategories = null) {
  let deck = [...cardDeck];
  
  // Filter by categories if provided
  if (selectedCategories && selectedCategories.length > 0) {
    deck = deck.filter(card => selectedCategories.includes(card.category));
  }
  
  return shuffleDeck(deck);
}

// Custom cards management
const CUSTOM_CARDS_KEY = 'conversationCards_customCards';

export function getCustomCards() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CUSTOM_CARDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading custom cards:', e);
    return [];
  }
}

export function saveCustomCard(card) {
  const customCards = getCustomCards();
  const newCard = {
    ...card,
    id: Date.now(), // Simple ID generation
    isCustom: true,
  };
  customCards.push(newCard);
  localStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(customCards));
  return newCard;
}

export function deleteCustomCard(cardId) {
  const customCards = getCustomCards();
  const filtered = customCards.filter(c => c.id !== cardId);
  localStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(filtered));
}

export function getAllCards(selectedCategories = null) {
  const customCards = getCustomCards();
  const allCards = [...cardDeck, ...customCards];
  
  if (selectedCategories && selectedCategories.length > 0) {
    return allCards.filter(card => selectedCategories.includes(card.category));
  }
  
  return allCards;
}
