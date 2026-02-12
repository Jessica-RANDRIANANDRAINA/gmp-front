type Props = {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
};

const CircularProgress = ({
  value,
  size = 48,
  stroke = 5,
  color = "#3b82f6",
}: Props) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = Math.min(Math.max(value, 0), 100);
  const offset = circumference * (1 - progress / 100);

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        {/* Cercle de fond */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />

        {/* Cercle de progression */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap={progress === 100 ? "butt" : "round"}
          style={{
            transition: "stroke-dashoffset 0.4s ease",
          }}
        />
      </svg>

      {/* Texte centré */}
      <span className="absolute text-xs font-semibold text-slate-700">
        {progress}%
      </span>
    </div>
  );
};

export default CircularProgress;
