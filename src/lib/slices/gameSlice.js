import { createSlice } from '@reduxjs/toolkit';
import { createShuffledDeck, cardTypes } from '../cards';

// Game phases
export const GAME_PHASES = {
  WAITING: 'waiting',
  CARD_REVEALED: 'card-revealed',
  COLLECTING_RESPONSES: 'collecting-responses',
  RESPONSE_COMPLETE: 'response-complete',
  GAME_OVER: 'game-over',
};

// Initial game state
const initialState = {
  gameStarted: false,
  currentPlayer: 1,
  deck: [],
  currentCard: null,
  phase: GAME_PHASES.WAITING,
  responses: {
    1: null,
    2: null,
  },
  cardRevealed: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state) => {
      const deck = createShuffledDeck();
      return {
        ...initialState,
        gameStarted: true,
        deck,
        currentPlayer: 1,
        phase: GAME_PHASES.WAITING,
      };
    },

    drawCard: (state) => {
      if (state.deck.length === 0) {
        state.phase = GAME_PHASES.GAME_OVER;
        return;
      }

      const drawnCard = state.deck.pop();
      
      console.log('🎴 Redux: DRAW_CARD - drawn card:', {
        id: drawnCard?.id,
        prompt: drawnCard?.prompt,
        type: drawnCard?.type,
        remainingCards: state.deck.length
      });

      state.currentCard = drawnCard;
      state.cardRevealed = false;
      state.phase = GAME_PHASES.CARD_REVEALED;
      state.responses = { 1: null, 2: null };
    },

    revealCard: (state) => {
      state.cardRevealed = true;
      state.phase = GAME_PHASES.COLLECTING_RESPONSES;
    },

    submitResponse: (state, action) => {
      const { playerNumber, response } = action.payload;
      state.responses[playerNumber] = response;

      // Check if all required responses are submitted
      const isBothResponse = state.currentCard?.type === cardTypes.BOTH_RESPONSE;
      const allResponsesComplete = isBothResponse
        ? state.responses[1] && state.responses[2]
        : state.responses[state.currentPlayer === 1 ? 2 : 1];

      state.phase = allResponsesComplete
        ? GAME_PHASES.RESPONSE_COMPLETE
        : GAME_PHASES.COLLECTING_RESPONSES;
    },

    nextTurn: (state) => {
      state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
      const hasCardsLeft = state.deck.length > 0;

      state.currentCard = null;
      state.cardRevealed = false;
      state.responses = { 1: null, 2: null };
      state.phase = hasCardsLeft ? GAME_PHASES.WAITING : GAME_PHASES.GAME_OVER;
    },

    resetGame: () => initialState,
  },
});

export const {
  startGame,
  drawCard,
  revealCard,
  submitResponse,
  nextTurn,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
