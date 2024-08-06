import { useEffect, useRef } from "react";
import { InputProps } from "../../../types/input";

const round = {
  full: "rounded-full",
  medium: "rounded-md",
  large: "rounded-lg",
  none: "",
};

const CustomInput = ({
  type,
  label,
  placeholder,
  className,
  rounded = "none",
  error,
  ...rest
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [error]);
  return (
    <div>
      <label className="mb-2 mt-3 block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <input
        ref={inputRef}
        type={type}
        className={`${className} ${round[rounded]} ${
          error &&
          "border-red-500 shadow-switcher shadow-red-500 focus:border-red-500 focus:shadow-switcher focus:shadow-red-500 dark:focus:border-red-500 dark:focus:shadow-switcher dark:focus:shadow-red-500 "
        }`}
        placeholder={placeholder}
        autoFocus={!!error}
        {...rest}
      />
      {error && <p className="flex text-sm mt-1 text-red-600">{error}</p>}
    </div>
  );
};

export default CustomInput;
