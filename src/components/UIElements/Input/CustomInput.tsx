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
  value,
  error,
  help,
  required = false,
  onChange,
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
    <div className={`${className} text-sm`}>
      <label className="mb-2.5 font-poppins font-semibold leading-relaxed block text-sm text-black dark:text-white ">
        <span className={`${help ? "cursor-help relative group" : ""} `}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          <span className="absolute text-xs  font-thin hidden group-hover:flex max-w-54 min-w-52 bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-999999 top-[-35px] left-1/2 transform -translate-x-1/2">
            {help}
          </span>
        </span>
      </label>
      {type === "textarea" ? (
        <textarea
          rows={rows}
          cols={cols}
          className={`w-full border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primaryGreen focus-visible:shadow-none dark:border-neutral-500 dark:focus:border-primaryGreen  ${round[rounded]}`}
          placeholder={placeholder}
          autoFocus={!!error}
          onChange={onChange}
          value={value}
          required={required}
        ></textarea>
      ) : (
        <input
          onChange={onChange}
          ref={inputRef}
          type={type}
          className={` w-full border  bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primaryGreen focus-visible:shadow-none dark:border-neutral-500 dark:focus:border-primaryGreen  ${
            round[rounded]
          }  ${
            error
              ? "border-red-500 focus:border-red-500 focus:shadow-switcher focus:shadow-red-500 dark:border-red-500 dark:focus:border-red-500 dark:focus:shadow-switcher dark:focus:shadow-red-500"
              : "border-stroke dark:border-neutral-500"
          }`}
          placeholder={placeholder}
          autoFocus={!!error}
          value={value}
          required={required}
          {...rest}
        />
      )}
      {error && <p className="flex text-xs mt-1 text-red-600">{error}</p>}
    </div>
  );
};

export default CustomInput;
