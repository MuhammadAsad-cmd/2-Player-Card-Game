import { createSlice } from '@reduxjs/toolkit';
import { getAllCards, shuffleDeck, cardTypes } from '../cards';

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
  gameHistory: [],
  turnNumber: 0,
  playerNames: {
    1: 'Player 1',
    2: 'Player 2',
  },
  responseTimestamps: {
    1: null,
    2: null,
  },
  soundEnabled: true,
  reactions: {}, // Format: { turnNumber: { playerNumber: [emoji] } }
  selectedCategories: null, // null means all categories
  favorites: [], // Array of { turnNumber, playerNumber } objects
  timerSettings: {
    enabled: false,
    duration: 60, // seconds
  },
  timerStartTime: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state, action) => {
      const selectedCategories = action.payload?.selectedCategories || state.selectedCategories;
      const allCards = getAllCards(selectedCategories);
      const deck = shuffleDeck(allCards);
      return {
        ...initialState,
        gameStarted: true,
        deck,
        currentPlayer: 1,
        phase: GAME_PHASES.WAITING,
        gameHistory: [],
        turnNumber: 0,
        playerNames: state.playerNames || initialState.playerNames,
        soundEnabled: state.soundEnabled !== undefined ? state.soundEnabled : true,
        selectedCategories: selectedCategories,
      };
    },

    setSelectedCategories: (state, action) => {
      state.selectedCategories = action.payload;
    },

    toggleFavorite: (state, action) => {
      const { turnNumber, playerNumber } = action.payload;
      const key = `${turnNumber}-${playerNumber}`;
      const index = state.favorites.findIndex(
        f => f.turnNumber === turnNumber && f.playerNumber === playerNumber
      );
      if (index > -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push({ turnNumber, playerNumber });
      }
    },

    setTimerSettings: (state, action) => {
      state.timerSettings = { ...state.timerSettings, ...action.payload };
    },

    startTimer: (state) => {
      if (state.timerSettings.enabled) {
        state.timerStartTime = Date.now();
      }
    },

    stopTimer: (state) => {
      state.timerStartTime = null;
    },

    drawCard: (state) => {
      if (state.deck.length === 0) {
        // Save last turn if it exists before ending game
        if (state.currentCard && (state.responses[1] || state.responses[2])) {
          const isLastTurnSaved = state.gameHistory.some(
            entry => entry.card?.id === state.currentCard.id &&
            entry.responses[1] === state.responses[1] &&
            entry.responses[2] === state.responses[2]
          );
          if (!isLastTurnSaved) {
            state.gameHistory.push({
              turnNumber: state.turnNumber + 1,
              card: { ...state.currentCard },
              activePlayer: state.currentPlayer,
              responses: { ...state.responses },
              timestamp: Date.now(),
            });
            state.turnNumber += 1;
          }
        }
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
      state.responseTimestamps[playerNumber] = Date.now();

      // Check if all required responses are submitted
      const isBothResponse = state.currentCard?.type === cardTypes.BOTH_RESPONSE;
      const allResponsesComplete = isBothResponse
        ? state.responses[1] && state.responses[2]
        : state.responses[state.currentPlayer === 1 ? 2 : 1];

      state.phase = allResponsesComplete
        ? GAME_PHASES.RESPONSE_COMPLETE
        : GAME_PHASES.COLLECTING_RESPONSES;
    },

    editResponse: (state, action) => {
      const { playerNumber, response } = action.payload;
      state.responses[playerNumber] = response;
    },

    setPlayerNames: (state, action) => {
      const { player1, player2 } = action.payload;
      state.playerNames[1] = player1 || 'Player 1';
      state.playerNames[2] = player2 || 'Player 2';
    },

    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },

    toggleReaction: (state, action) => {
      const { turnNumber, playerNumber, emoji } = action.payload;
      const key = `${turnNumber}-${playerNumber}`;
      if (!state.reactions[key]) {
        state.reactions[key] = [];
      }
      const index = state.reactions[key].indexOf(emoji);
      if (index > -1) {
        state.reactions[key].splice(index, 1);
      } else {
        state.reactions[key].push(emoji);
      }
    },

    nextTurn: (state) => {
      // Save current turn to history before clearing
      if (state.currentCard && (state.responses[1] || state.responses[2])) {
        const turnNum = state.turnNumber + 1;
        // Save reactions for this turn
        const turnReactions = {
          1: state.reactions[`${turnNum}-1`] || [],
          2: state.reactions[`${turnNum}-2`] || [],
        };
        state.gameHistory.push({
          turnNumber: turnNum,
          card: { ...state.currentCard },
          activePlayer: state.currentPlayer,
          responses: { ...state.responses },
          responseTimestamps: { ...state.responseTimestamps },
          reactions: turnReactions,
          timestamp: Date.now(),
        });
        state.turnNumber += 1;
      }

      state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
      const hasCardsLeft = state.deck.length > 0;

      state.currentCard = null;
      state.cardRevealed = false;
      state.responses = { 1: null, 2: null };
      state.responseTimestamps = { 1: null, 2: null };
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
  editResponse,
  setPlayerNames,
  toggleSound,
  toggleReaction,
  setSelectedCategories,
  toggleFavorite,
  setTimerSettings,
  startTimer,
  stopTimer,
  nextTurn,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
