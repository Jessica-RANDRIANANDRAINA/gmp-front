import { useEffect, useRef } from "react";
import { InputProps } from "../../../types/input";

const round = {
  full: "rounded-full",
  medium: "rounded-md",
  large: "rounded-lg",
  none: "",
};

const CustomInput = ({
  type = "text",
  label,
  placeholder,
  className = "",
  rounded = "none",
  cols,
  rows,
  value,
  error,
  help,
  required = false,
  onChange,
  suffix,
  ...rest
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  return (
    <div className={`text-sm ${className}`}>
      {/* LABEL */}
      {label && (
        <label className="mb-1 font-poppins font-semibold leading-relaxed block text-sm text-black dark:text-white">
          <span className={`${help ? "cursor-help relative group" : ""}`}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}

            {/* TOOLTIP */}
            {help && (
              <span
                className="
                  absolute text-xs font-thin hidden group-hover:flex
                  max-w-54 min-w-52 bg-white text-black
                  p-2 border border-whiten shadow-5
                  rounded-md z-[999999]
                  top-[-35px] left-1 transform -translate-x-1
                "
              >
                {help}
              </span>
            )}
          </span>
        </label>
      )}

      {/* TEXTAREA */}
      {type === "textarea" ? (
        <textarea
          rows={rows}
          cols={cols}
          className={`
            w-full border bg-transparent py-3 px-3
            text-black dark:text-gray outline-none
            focus:border-primaryGreen focus-visible:shadow-none
            dark:border-formStrokedark dark:focus:border-primaryGreen
            ${round[rounded]}
            ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-stroke dark:border-formStrokedark"
            }
          `}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      ) : (
        /* INPUT */
        <div className="relative">
          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            autoFocus={!!error}
            className={`
              w-full md:h-10 border bg-transparent
              py-3 px-3 ${suffix ? "pr-10" : ""}
              text-black dark:text-gray outline-none
              focus:border-primaryGreen focus-visible:shadow-none
              dark:border dark:border-formStrokedark dark:focus:border-primaryGreen
              ${round[rounded]}
              ${
                error
                  ? "border-red-500 focus:border-red-500 focus:shadow-switcher focus:shadow-red-500"
                  : "border-stroke dark:border-formStrokedark"
              }
            `}
            {...rest}
          />

          {/* SUFFIX */}
          {suffix && (
            <span
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                text-gray-400 font-semibold
                pointer-events-none
              "
            >
              {suffix}
            </span>
          )}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <p className="flex text-xs mt-1 text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomInput;
