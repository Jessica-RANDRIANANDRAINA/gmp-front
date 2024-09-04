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
  cols,
  rows,
  error,
  onChange,
  ...rest
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement >(null);

  useEffect(() => {
    if (error && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [error]);
  return (
    <div>
      <label className="mb-2.5 font-poppins font-semibold leading-relaxed block text-sm text-black dark:text-white">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          rows={rows}
          cols={cols}
          className={`w-full border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primaryGreen focus-visible:shadow-none dark:border-neutral-500 dark:focus:border-primaryGreen ${className} ${round[rounded]}`}
          placeholder={placeholder}
          autoFocus={!!error}
          onChange={onChange}
        ></textarea>
      ) : (
        <input
        onChange={onChange}
          ref={inputRef}
          type={type}
          className={` w-full border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primaryGreen focus-visible:shadow-none dark:border-neutral-500 dark:focus:border-primaryGreen ${className} ${
            round[rounded]
          } ${
            error &&
            "border-red-500 shadow-switcher shadow-red-500 focus:border-red-500 focus:shadow-switcher focus:shadow-red-500 dark:focus:border-red-500 dark:focus:shadow-switcher dark:focus:shadow-red-500 "
          }`}
          placeholder={placeholder}
          autoFocus={!!error}
          {...rest}
        />
      )}
      {error && <p className="flex text-sm mt-1 text-red-600">{error}</p>}
    </div>
  );
};

export default CustomInput;
