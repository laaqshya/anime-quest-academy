import { useEffect, useState } from "react";

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

const CherryBlossoms = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const p: Petal[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      size: 8 + Math.random() * 12,
    }));
    setPetals(p);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute animate-petal-fall opacity-70"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: p.size,
            height: p.size,
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{ background: `hsl(340, 80%, ${75 + Math.random() * 10}%)` }}
          />
        </div>
      ))}
    </div>
  );
};

export default CherryBlossoms;
