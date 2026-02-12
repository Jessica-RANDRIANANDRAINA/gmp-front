import { useEffect } from "react";

const ErrorBadge = ({
  message,
  duration = 5000,
  onClose,
  offsetY = "30%" // 🔥 Hauteur personnalisable (30% depuis le haut)
}: {
  message: string;
  duration?: number;
  onClose: () => void;
  offsetY?: string; // <-- hauteur personnalisable
}) => {
  useEffect(() => {

    if (navigator.vibrate) {
    navigator.vibrate(80);
  }

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
    className="
      fixed 
      left-1/2 
      transform -translate-x-1/2 
      bg-red-600 text-white 
      px-6 py-3 rounded-lg shadow-lg 
      animate-fade-in 
      opacity-0 
      animate-errorBadgeShow
      z-[999999]
    "
    style={{ top: offsetY }}
  >
    {message}
  </div>
  );
};

export default ErrorBadge;
