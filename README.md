# 2-Player Card Game

An elegant frontend-focused 2-player card game built with Next.js, React, and Tailwind CSS.

## Game Overview

This is a turn-based card game where two players take turns drawing cards from a deck. Each card contains a prompt or instruction that requires responses from one or both players. The game manages the flow and turn-taking, but does not evaluate the responses - it's all about the conversation and interaction!

### How to Play

1. **Start the Game**: The game automatically starts when you load the page
2. **Take Turns**: Players alternate turns drawing cards
3. **Draw a Card**: The active player clicks the deck to draw a card
4. **Respond to Prompts**: 
   - **Single-response cards**: The other player responds
   - **Both-response cards**: Both players respond
5. **Continue**: After responses are submitted, click "Next Turn" to continue
6. **Game End**: The game ends when all cards are drawn

## Features

- ✨ Elegant, premium UI design with smooth animations
- 🎴 Card flip animations for card reveals
- 👥 Clear player indicators showing whose turn it is
- 📝 Response collection with validation
- 🌓 Dark mode support
- 📱 Fully responsive design
- 🎯 Turn-based game flow management

## Tech Stack

- **Next.js 16** - React framework
- **React 19** - UI library
- **Redux Toolkit** - State management
- **Redux Persist** - State persistence
- **Framer Motion** - Animation library
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icon library
- **Biome** - Linting and formatting

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the game.

### Build

```bash
npm run build
npm start
```

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build
4. Deploy!

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Design Decisions

- **Single-page application**: Keeps focus on the game flow
- **State management**: Uses **Redux Toolkit** with **Redux Persist** for predictable state and automatic persistence
- **No backend required**: All game logic runs in the browser
- **Elegant animations**: Smooth, purposeful transitions using Framer Motion
- **Progressive disclosure**: UI elements appear based on game phase

## Project Structure

```
src/
├── app/
│   ├── page.js          # Main game component
│   ├── layout.js         # Root layout
│   └── globals.css       # Global styles and animations
├── components/
│   ├── Card.js           # Card component with flip animation
│   ├── Deck.js           # Deck visualization
│   ├── GameControls.js   # Action buttons
│   ├── PlayerIndicator.js # Player status display
│   └── ResponseInput.js  # Response collection UI
└── lib/
    └── cards.js          # Card data and deck utilities
```

## Future Enhancements

With more time, I would add:
- Game history/recap at the end
- Custom player names
- Card categories/themes
- Response editing before submission
- Turn timer (optional)
- Custom card creation
- Multiple saved games
- Export game history as PDF/text
- Full keyboard navigation and accessibility features

## Notes

See [NOTES.md](./NOTES.md) for detailed information about:
- How game rules were interpreted
- Design and UX decisions
- Technical architecture
- What would be improved with more time