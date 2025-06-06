"use client";

import { useState } from 'react';
import { MOVE_ICONS, Move } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MoveSelectionProps {
  selectedMove: Move;
  onSelectMove: (move: Move) => void;
  disabled?: boolean;
}

const moveOptions = [
  { value: Move.Rock, label: "Rock", icon: MOVE_ICONS[Move.Rock] },
  { value: Move.Paper, label: "Paper", icon: MOVE_ICONS[Move.Paper] },
  { value: Move.Scissors, label: "Scissors", icon: MOVE_ICONS[Move.Scissors] },
];

export function MoveSelection({ selectedMove, onSelectMove, disabled = false }: MoveSelectionProps) {
  const [hoveredMove, setHoveredMove] = useState<Move | null>(null);

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {moveOptions.map((option) => (
        <motion.button
          key={option.value}
          type="button"
          onClick={() => onSelectMove(option.value)}
          onMouseEnter={() => setHoveredMove(option.value)}
          onMouseLeave={() => setHoveredMove(null)}
          disabled={disabled}
          className={cn(
            "flex flex-col items-center p-6 rounded-lg transition-all relative",
            "border-2 hover:shadow-md",
            selectedMove === option.value 
              ? "border-primary bg-primary/10" 
              : "border-border bg-background",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            y: selectedMove === option.value ? -5 : 0,
            boxShadow: selectedMove === option.value 
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              : "0 0 0 0 rgba(0, 0, 0, 0)"
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <span className="text-4xl mb-2">{option.icon}</span>
          <span className="text-sm font-medium">{option.label}</span>
          
          {(selectedMove === option.value || hoveredMove === option.value) && (
            <motion.div
              className="absolute inset-0 rounded-lg bg-primary/5"
              layoutId="move-highlight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}