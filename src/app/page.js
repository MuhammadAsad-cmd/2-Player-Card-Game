'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { cardTypes } from '../lib/cards';
import { soundManager } from '../lib/sounds';
import Card from '../components/Card';
import PlayerIndicator from '../components/PlayerIndicator';
import Deck from '../components/Deck';
import ResponseInput from '../components/ResponseInput';
import GameControls from '../components/GameControls';
import ShareButton from '../components/ShareButton';
import ResponseHistoryPanel from '../components/ResponseHistoryPanel';
import GameRecap from '../components/GameRecap';
import PlayerNameModal from '../components/PlayerNameModal';
import SoundToggle from '../components/SoundToggle';
import CategorySelector from '../components/CategorySelector';
import Timer from '../components/Timer';
import CardCreator from '../components/CardCreator';
import { GAME_PHASES, startGame, drawCard, revealCard, submitResponse, editResponse, setPlayerNames, toggleSound, toggleReaction, setSelectedCategories, toggleFavorite, setTimerSettings, startTimer, stopTimer, nextTurn, resetGame } from '../lib/slices/gameSlice';
import { Trophy, RotateCcw, Settings, Plus } from 'lucide-react';

export default function Home() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.game);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCardCreator, setShowCardCreator] = useState(false);

  // Update sound manager when soundEnabled changes
  useEffect(() => {
    if (soundManager) {
      soundManager.setEnabled(state.soundEnabled);
    }
  }, [state.soundEnabled]);

  // Initialize game on mount
  useEffect(() => {
    if (!state.gameStarted) {
      // Show name modal if names are default
      if (state.playerNames[1] === 'Player 1' && state.playerNames[2] === 'Player 2') {
        setShowNameModal(true);
      } else {
        setIsShuffling(true);
        if (soundManager && state.soundEnabled) {
          soundManager.playShuffle();
        }
        setTimeout(() => {
          dispatch(startGame());
          setIsShuffling(false);
        }, 1000);
      }
    }
  }, [state.gameStarted, dispatch, state.playerNames]);

  // Handle player name confirmation
  const handleNameConfirm = (names) => {
    dispatch(setPlayerNames(names));
    setShowNameModal(false);
    setShowCategoryModal(true);
  };

  // Handle category selection
  const handleCategoryConfirm = (categories) => {
    dispatch(setSelectedCategories(categories));
    setShowCategoryModal(false);
    setIsShuffling(true);
    if (soundManager && state.soundEnabled) {
      soundManager.playShuffle();
    }
    setTimeout(() => {
      dispatch(startGame({ selectedCategories: categories }));
      setIsShuffling(false);
    }, 1000);
  };

  // Handle card flip completion
  const handleCardFlipComplete = () => {
    console.log('🃏 Card flip complete callback triggered');
    console.log('🃏 Current card:', state.currentCard?.prompt);
    // Don't set cardFlipped here - it's already set in handleDrawCard
    // Just dispatch the reveal action
    dispatch(revealCard());
    if (soundManager && state.soundEnabled) {
      soundManager.playCardFlip();
    }
  };

  // Handle drawing a card
  const handleDrawCard = () => {
    console.log('🎴 === Draw card clicked ===');
    console.log('🎴 Current state before draw:', { 
      phase: state.phase, 
      deckLength: state.deck.length,
      currentCard: state.currentCard?.prompt || 'No card'
    });
    
    setCardFlipped(false);
    dispatch(drawCard());
    dispatch(startTimer());
    
    if (soundManager && state.soundEnabled) {
      soundManager.playCardDraw();
    }
    
    // Auto-flip card after a brief delay for deal animation
    setTimeout(() => {
      console.log('🔄 Setting cardFlipped to true');
      setCardFlipped(true);
      
      // Log state after a moment to see the new card
      setTimeout(() => {
        console.log('✅ State after draw:', {
          phase: state.phase,
          currentCard: state.currentCard?.prompt || 'No card',
          cardFlipped: true
        });
      }, 100);
    }, 300);
  };

  // Handle response submission
  const handleSubmitResponse = (playerNumber, response) => {
    dispatch(submitResponse({ playerNumber, response }));
    if (soundManager && state.soundEnabled) {
      soundManager.playSubmit();
    }
  };

  // Handle response editing
  const handleEditResponse = (playerNumber, response) => {
    dispatch(editResponse({ playerNumber, response }));
  };

  // Handle reaction toggle
  const handleToggleReaction = (turnNumber, playerNumber, emoji) => {
    dispatch(toggleReaction({ turnNumber, playerNumber, emoji }));
  };

  // Handle favorite toggle
  const handleToggleFavorite = (turnNumber, playerNumber) => {
    dispatch(toggleFavorite({ turnNumber, playerNumber }));
  };

  // Check if response is favorited
  const isFavorite = (turnNumber, playerNumber) => {
    return state.favorites.some(
      f => f.turnNumber === turnNumber && f.playerNumber === playerNumber
    );
  };

  // Handle next turn
  const handleNextTurn = () => {
    setCardFlipped(false);
    dispatch(nextTurn());
  };

  // Handle game reset
  const handleResetGame = () => {
    setCardFlipped(false);
    setIsShuffling(true);
    if (soundManager && state.soundEnabled) {
      soundManager.playShuffle();
    }
    dispatch(resetGame());
    setTimeout(() => {
      dispatch(startGame());
      setIsShuffling(false);
    }, 1000);
  };

  // Determine which players need to respond
  const getRespondingPlayers = () => {
    if (!state.currentCard) return { player1: false, player2: false };

    if (state.currentCard.type === cardTypes.BOTH_RESPONSE) {
      return { player1: true, player2: true };
    }

    // Single response: other player responds
    return {
      player1: state.currentPlayer === 2,
      player2: state.currentPlayer === 1,
    };
  };

  const respondingPlayers = getRespondingPlayers();
  const isPlayer1Active = state.currentPlayer === 1;
  const isPlayer2Active = state.currentPlayer === 2;

  // Play game over sound once
  useEffect(() => {
    if (state.phase === GAME_PHASES.GAME_OVER && soundManager && state.soundEnabled) {
      soundManager.playGameOver();
    }
  }, [state.phase, state.soundEnabled]);

  // Handle play again (starts new game)
  const handlePlayAgain = () => {
    handleResetGame();
  };

  // Game over screen - show recap
  if (state.phase === GAME_PHASES.GAME_OVER) {
    return (
      <GameRecap
        gameHistory={state.gameHistory}
        playerNames={state.playerNames}
        onPlayAgain={handlePlayAgain}
        onResetGame={handleResetGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 relative">
      {/* Player Name Modal */}
      <PlayerNameModal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        onConfirm={handleNameConfirm}
        playerNames={state.playerNames}
      />

      {/* Category Selector Modal */}
      <CategorySelector
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onConfirm={handleCategoryConfirm}
        selectedCategories={state.selectedCategories}
      />

      {/* Card Creator Modal */}
      <CardCreator
        isOpen={showCardCreator}
        onClose={() => setShowCardCreator(false)}
        onCardAdded={() => {
          // Refresh deck if game is active
          if (state.gameStarted) {
            // Optionally refresh the game with new cards
          }
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10 pt-8 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-8 right-0 flex gap-2">
            <SoundToggle />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCardCreator(true)}
                className="p-2 bg-[#1a1a1a] border border-[#2a2a2a] cursor-pointer rounded-lg hover:bg-[#252525] transition-all duration-200 text-white"
                title="Create custom cards"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="p-2 bg-[#1a1a1a] border border-[#2a2a2a] cursor-pointer rounded-lg hover:bg-[#252525] transition-all duration-200 text-white"
                title="Select card categories"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">
            2-Player Card Game
          </h1>
          <p className="text-lg text-[#a0a0a0]">
            Take turns drawing cards and responding to prompts
          </p>
        </motion.div>

        {/* Player Indicators */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PlayerIndicator
            playerNumber={1}
            isActive={isPlayer1Active}
            playerName={state.playerNames[1]}
          />
          <PlayerIndicator
            playerNumber={2}
            isActive={isPlayer2Active}
            playerName={state.playerNames[2]}
          />
        </motion.div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 w-full">
          {/* Left: Deck */}
          <motion.div
            className="flex flex-col items-center justify-center lg:justify-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              Deck
            </h2>
            <Deck
              cardCount={state.deck.length}
              onDrawCard={handleDrawCard}
              canDraw={
                state.phase === GAME_PHASES.WAITING && state.deck.length > 0
              }
              isShuffling={isShuffling}
            />
          </motion.div>

          {/* Center: Card Display */}
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              Current Card
            </h2>
            <AnimatePresence mode="wait">
              {state.currentCard ? (
                <motion.div
                  key={state.currentCard.id}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  transition={{ duration: 0.5 }}
                  className="animate-deal"
                >
                  {(() => {
                    const revealState = cardFlipped || state.cardRevealed;
                    return (
                      <Card
                        card={state.currentCard}
                        isRevealed={revealState}
                        onFlipComplete={handleCardFlipComplete}
                      />
                    );
                  })()}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="w-80 h-[400px] flex items-center justify-center bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-[#666666] text-lg font-medium">
                    Draw a card to begin
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: Game Info */}
          <motion.div
            className="flex flex-col items-center justify-center lg:justify-start"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              Game Status
            </h2>
            <div className="bg-[#1a1a1a] rounded-xl p-6 shadow-lg w-full max-w-xs border border-[#2a2a2a]">
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-[#a0a0a0] font-medium">
                    Phase:
                  </span>
                  <p className="font-semibold text-white capitalize text-lg mt-1">
                    {state.phase.replace(/-/g, ' ')}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-[#a0a0a0] font-medium">
                    Cards Remaining:
                  </span>
                  <p className="font-semibold text-white text-lg mt-1">
                    {state.deck.length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Response Area */}
        <AnimatePresence>
          {(state.phase === GAME_PHASES.COLLECTING_RESPONSES ||
            state.phase === GAME_PHASES.RESPONSE_COMPLETE) && (
            <motion.div
              className="max-w-4xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl p-8 border border-[#2a2a2a]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white">
                    Responses
                  </h2>
                  {state.phase === GAME_PHASES.RESPONSE_COMPLETE && (
                    <ShareButton
                      responses={state.responses}
                      currentCard={state.currentCard}
                    />
                  )}
                </div>
                <div className="space-y-6">
                  {respondingPlayers.player1 && (
                    <ResponseInput
                      playerNumber={1}
                      playerName={state.playerNames[1]}
                      onSubmit={(response) => handleSubmitResponse(1, response)}
                      onEdit={(response) => handleEditResponse(1, response)}
                      isRequired={true}
                      isSubmitted={!!state.responses[1]}
                      submittedResponse={state.responses[1]}
                      canEdit={state.phase === GAME_PHASES.RESPONSE_COMPLETE}
                      timestamp={state.responseTimestamps[1]}
                      turnNumber={state.turnNumber + 1}
                      reactions={state.reactions[`${state.turnNumber + 1}-1`] || []}
                      onToggleReaction={handleToggleReaction}
                      isFavorite={isFavorite(state.turnNumber + 1, 1)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  )}
                  {respondingPlayers.player2 && (
                    <ResponseInput
                      playerNumber={2}
                      playerName={state.playerNames[2]}
                      onSubmit={(response) => handleSubmitResponse(2, response)}
                      onEdit={(response) => handleEditResponse(2, response)}
                      isRequired={true}
                      isSubmitted={!!state.responses[2]}
                      submittedResponse={state.responses[2]}
                      canEdit={state.phase === GAME_PHASES.RESPONSE_COMPLETE}
                      timestamp={state.responseTimestamps[2]}
                      turnNumber={state.turnNumber + 1}
                      reactions={state.reactions[`${state.turnNumber + 1}-2`] || []}
                      onToggleReaction={handleToggleReaction}
                      isFavorite={isFavorite(state.turnNumber + 1, 2)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Controls */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <GameControls
            onDrawCard={handleDrawCard}
            onNextTurn={handleNextTurn}
            canDrawCard={
              state.phase === GAME_PHASES.WAITING && state.deck.length > 0
            }
            canNextTurn={state.phase === GAME_PHASES.RESPONSE_COMPLETE}
            gamePhase={state.phase}
          />
        </motion.div>
      </div>

      {/* Response History Panel */}
      <ResponseHistoryPanel />
    </div>
  );
}
