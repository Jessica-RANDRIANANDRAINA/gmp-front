import { useState, useRef, useEffect } from "react";

type CustomSelectChoiceProps = {
  options: string[];
  onChange: (selected: string[]) => void;
  label: string;
  rounded?: "full" | "medium" | "large" | "none";
  resetToAll?: boolean;
};

const round = {
  full: "rounded-full",
  medium: "rounded-md",
  large: "rounded-lg",
  none: "",
};

const CustomSelectChoice = ({
  options,
  onChange,
  label,
  rounded = "none",
  resetToAll,
}: CustomSelectChoiceProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allSelected = selectedValues.length === options.length; // Vérifie si toutes les options sont sélectionnées
  const isIndeterminate = selectedValues.length > 0 && !allSelected; // Vérifie si au moins une option est sélectionnée mais pas toutes

  // reset to all
  useEffect(() => {
    if (resetToAll) {
      setSelectedValues(options);
      onChange(options);
    }
  }, [resetToAll, options, onChange]);

  // Appeler onChange au montage pour informer le parent
  useEffect(() => {
    if (selectedValues.length === 0) {
      setSelectedValues(options);
      onChange(options);
    }
  }, [onChange, options]);

  // Ouvrir/fermer le menu
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Gestion des cases à cocher
  const handleCheckboxChange = (value: string) => {
    setSelectedValues((prev) => {
      const updated = prev.includes(value)
        ? prev.filter((v) => v !== value) // Décoche
        : [...prev, value]; // Coche

      // Assurez-vous qu'il y a toujours au moins une option cochée
      if (updated.length === 0 && value !== "Tous") {
        updated.push(options[0]); // Assurez-vous que la première option est sélectionnée par défaut
      }

      onChange(updated); // Appeler le callback
      return updated;
    });
  };

  // Gestion de la case "Tous"
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedValues([options[0]]); // Si toutes sont cochées, décocher tout et laisser une option sélectionnée
      onChange([options[0]]);
    } else {
      setSelectedValues(options); // Sinon, tout cocher
      onChange(options);
    }
  };

  // Fermer le menu en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <label className="mb-2.5 min-w-20 leading-relaxed block font-semibold font-poppins text-sm text-black dark:text-white">
        {label}
      </label>
      <button
        onClick={toggleDropdown}
        className={`w-full text-sm py-2.5 px-6 md:h-10 border flex items-center justify-between border-stroke dark:border-formStrokedark ${round[rounded]} bg-transparent text-left whitespace-nowrap overflow-hidden text-ellipsis`}
      >
        {allSelected
          ? "Tous"
          : selectedValues.length > 0
          ? selectedValues.join(", ").length > 20
            ? `${selectedValues.join(", ").slice(0, 20)}...`
            : selectedValues.join(", ")
          : "Select options"}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 bg-white dark:bg-black border border-stroke dark:border-formStrokedark rounded shadow-md max-h-60 overflow-y-auto">
          {/* Option "Tous" */}
          <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(el) => {
                if (el) el.indeterminate = isIndeterminate; // Indicateur d'état intermédiaire
              }}
              onChange={handleSelectAll}
              className="mr-2"
            />
            Tous
          </label>

          {/* Autres options */}
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                value={option}
                checked={selectedValues.includes(option)}
                onChange={() => handleCheckboxChange(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelectChoice;
