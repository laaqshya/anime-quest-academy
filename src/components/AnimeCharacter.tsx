import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import animeChar from "@/assets/anime-character.png";

interface Props {
  mood?: "idle" | "happy" | "sad" | "wave";
  message?: string;
}

const messages = [
  "Hey! How are you? Where do you want to begin? 🌸",
  "You got this! Let's level up! ⚡",
  "Ready for a new challenge? 🗡️",
];

const AnimeCharacter = ({ mood = "idle", message }: Props) => {
  const [currentMsg, setCurrentMsg] = useState(message || messages[0]);
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    if (message) {
      setCurrentMsg(message);
      setShowBubble(true);
    }
  }, [message]);

  useEffect(() => {
    if (!message) {
      const interval = setInterval(() => {
        setCurrentMsg(messages[Math.floor(Math.random() * messages.length)]);
        setShowBubble(true);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [message]);

  const getMoodAnimation = () => {
    switch (mood) {
      case "happy": return { y: [0, -20, 0], rotate: [0, 5, -5, 0], transition: { duration: 0.6 } };
      case "sad": return { y: [0, 5, 0], rotate: [0, -3, 3, 0], transition: { duration: 0.8 } };
      case "wave": return { rotate: [0, 10, -10, 10, 0], transition: { duration: 1 } };
      default: return { y: [0, -5, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const } };
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="glass rounded-2xl px-5 py-3 mb-4 max-w-[280px] text-center relative"
          >
            <p className="text-sm font-semibold">{currentMsg}</p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 glass rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div animate={getMoodAnimation()} className="w-40 h-40 md:w-56 md:h-56">
        <img src={animeChar} alt="Your anime companion" className="w-full h-full object-contain drop-shadow-2xl" />
      </motion.div>
    </div>
  );
};

export default AnimeCharacter;
