'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { cardTypes } from '../lib/cards';
import { GAME_PHASES, startGame, drawCard, revealCard, submitResponse, nextTurn, resetGame } from '../lib/slices/gameSlice';
import { soundManager } from '../lib/sounds';
import Card from '../components/Card';
import PlayerIndicator from '../components/PlayerIndicator';
import Deck from '../components/Deck';
import ResponseInput from '../components/ResponseInput';
import GameControls from '../components/GameControls';
import ShareButton from '../components/ShareButton';
import { Trophy, RotateCcw } from 'lucide-react';

export default function Home() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.game);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    if (!state.gameStarted) {
      setIsShuffling(true);
      if (soundManager) {
        soundManager.playShuffle();
      }
      setTimeout(() => {
        dispatch(startGame());
        setIsShuffling(false);
      }, 1000);
    }
  }, [state.gameStarted, dispatch]);

  // Handle card flip completion
  const handleCardFlipComplete = () => {
    console.log('🃏 Card flip complete callback triggered');
    console.log('🃏 Current card:', state.currentCard?.prompt);
    // Don't set cardFlipped here - it's already set in handleDrawCard
    // Just dispatch the reveal action
    dispatch(revealCard());
    if (soundManager) {
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
    
    if (soundManager) {
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
    if (soundManager) {
      soundManager.playSubmit();
    }
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
    if (soundManager) {
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
    if (state.phase === GAME_PHASES.GAME_OVER && soundManager) {
      soundManager.playGameOver();
    }
  }, [state.phase]);

  // Game over screen
  if (state.phase === GAME_PHASES.GAME_OVER) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-[#0f0f0f] p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-2xl w-full bg-[#1a1a1a] rounded-2xl shadow-2xl p-10 text-center border border-[#2a2a2a]"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.div
            className="text-7xl mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            <Trophy className="w-20 h-20 mx-auto text-[#fbbf24]" />
          </motion.div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Game Complete!
          </h1>
          <p className="text-lg text-[#a0a0a0] mb-8">
            You've gone through all the cards. Great game!
          </p>
          <motion.button
            onClick={handleResetGame}
            className="px-8 py-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto border border-[#3b82f6]/50"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10 pt-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
            playerName="Player 1"
          />
          <PlayerIndicator
            playerNumber={2}
            isActive={isPlayer2Active}
            playerName="Player 2"
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
                      playerName="Player 1"
                      onSubmit={(response) => handleSubmitResponse(1, response)}
                      isRequired={true}
                      isSubmitted={!!state.responses[1]}
                      submittedResponse={state.responses[1]}
                    />
                  )}
                  {respondingPlayers.player2 && (
                    <ResponseInput
                      playerNumber={2}
                      playerName="Player 2"
                      onSubmit={(response) => handleSubmitResponse(2, response)}
                      isRequired={true}
                      isSubmitted={!!state.responses[2]}
                      submittedResponse={state.responses[2]}
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
    </div>
  );
}
