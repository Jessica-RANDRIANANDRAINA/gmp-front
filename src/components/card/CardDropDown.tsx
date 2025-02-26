import React, { useState, useRef, useEffect } from "react";
import { CardDropDownProps } from "../../types/Card";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const CardDropDown: React.FC<CardDropDownProps> = ({
  title,
  primaryColor,
  activity,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Gestion du clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div
        className="py-5 px-4 rounded-xl shadow-md bg-white dark:bg-strokedark transition-all duration-300 border-opacity-80 hover:shadow-xl cursor-pointer flex justify-between items-center"
        style={{ borderLeft: `5px solid ${primaryColor}` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <div className="text-lg font-semibold text-slate-800 dark:text-white">
            {title}
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-300 mt-1">
            50h
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-slate-500 dark:text-slate-300"
        >
          <ChevronDown size={24} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute z-999 left-0 right-0 mt-2 bg-white dark:bg-strokedark shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 scrollbar-track-slate-100 dark:scrollbar-track-slate-800 rounded-lg">
              {activity?.map((item, index) => (
                <div
                  key={index}
                  className="px-6 py-3 flex justify-between items-center border-b last:border-none border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300 transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-[1.02]"
                >
                  <span className="text-base font-medium">{item.label}</span>
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">
                    {item.value}h
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardDropDown;
