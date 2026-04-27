import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const getInitialSnake = (): Point[] => [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

const getRandomFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(getInitialSnake());
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  const directionRef = useRef<Direction>(direction);
  const lastUpdateRef = useRef<number>(0);
  const requestRef = useRef<number>();

  directionRef.current = direction;

  const resetGame = () => {
    setSnake(getInitialSnake());
    setDirection('UP');
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(getRandomFood(getInitialSnake()));
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
      e.preventDefault();
    }
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (directionRef.current !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (directionRef.current !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (directionRef.current !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (directionRef.current !== 'LEFT') setDirection('RIGHT');
        break;
      case ' ':
      case 'Escape':
        if (!isGameOver) {
          setIsPaused(prev => !prev);
        }
        break;
    }
  }, [isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const updateGame = useCallback((time: number) => {
    if (isGameOver || isPaused) {
      requestRef.current = requestAnimationFrame(updateGame);
      return;
    }

    const currentSpeed = Math.max(40, INITIAL_SPEED - (Math.floor(score / 5) * 8));

    if (time - lastUpdateRef.current >= currentSpeed) {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (directionRef.current) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true);
          setHighScore(prev => Math.max(prev, score));
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          setHighScore(prev => Math.max(prev, score));
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(getRandomFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
      lastUpdateRef.current = time;
    }
    requestRef.current = requestAnimationFrame(updateGame);
  }, [direction, food, isGameOver, isPaused, score]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateGame);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updateGame]);

  return (
    <div className="flex flex-col items-center w-full p-6 pt-8 mt-2">
      <div className="w-full flex justify-between items-end mb-4">
        <div className="text-3xl text-yellow uppercase border-l-8 border-yellow pl-3 leading-none bg-yellow/10 pr-2 py-1">
          BYTES: {score}
        </div>
        <div className="text-2xl text-cyan/70 uppercase">
          SYS_MAX: {highScore}
        </div>
      </div>

      <div 
        className="relative bg-black border-4 border-magenta w-full max-w-[500px] aspect-square shadow-[0px_0px_20px_0px_rgba(255,0,255,0.4)]"
      >
        <div className="absolute inset-0 grid pointer-events-none" style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          backgroundImage: 'linear-gradient(to right, #00ffff22 1px, transparent 1px), linear-gradient(to bottom, #00ffff22 1px, transparent 1px)',
          backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
        }} />

        {snake.map((segment, i) => {
          const isHead = i === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${i}`}
              className={`absolute transition-all duration-75`}
              style={{
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                backgroundColor: isHead ? 'var(--color-yellow)' : 'var(--color-cyan)',
                border: '2px solid black'
              }}
            />
          )
        })}

        <div
          className="absolute"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            backgroundColor: 'var(--color-magenta)',
            border: '2px solid white',
            boxShadow: '0 0 10px var(--color-magenta)'
          }}
        />

        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20">
            <h2 className="text-6xl text-magenta mb-4 uppercase glitch-text" data-text="FATAL ERROR">FATAL ERROR</h2>
            <div className="bg-magenta text-black px-4 py-2 mb-8 text-2xl font-bold">SEGMENTATION FAULT. SCORE: {score}</div>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-black text-cyan border-4 border-cyan hover:bg-cyan hover:text-black uppercase text-3xl cursor-pointer shadow-[4px_4px_0px_0px_#00ffff]"
            >
              REBOOT_SYSTEM()
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
           <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 border-[8px] border-yellow border-dashed">
             <h2 className="text-6xl text-yellow md:text-7xl uppercase mb-4 animate-pulse">SYSTEM HALT</h2>
             <p className="text-white text-3xl bg-black py-1 px-3 border-2 border-white">AWAITING INPUT [SPACE]</p>
           </div>
        )}
      </div>

      <div className="mt-8 text-cyan border-2 border-cyan px-4 py-2 text-2xl inline-block bg-cyan/10 uppercase">
         INPUT: WASD | HALT: SPACE
      </div>
    </div>
  );
}
