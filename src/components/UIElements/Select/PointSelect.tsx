import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { InputSelectprops } from "../../../types/input";

const PointSelect = ({
    data,
    placeholder,
    onValueChange,
    value,
    label,
    className,
    required = false,
    disabled = false,
}: InputSelectprops) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownStyles, setDropdownStyles] = useState({});
    const trigger = useRef<any>(null);

    // Gestion du clic extérieur
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (
                !isOpen ||
                trigger.current?.contains(target)
            ) return;
            setIsOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    }, [isOpen]);

    // Calcul dynamique de la position
    useEffect(() => {
        if (isOpen && trigger.current) {
            const rect = trigger.current.getBoundingClientRect();
            setDropdownStyles({
                position: "absolute",
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX,
                minWidth: rect.width,
                zIndex: 50,
            });
        }
    }, [isOpen]);

    const handleSelect = (option: any) => {
        onValueChange(option);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="mb-1 block font-semibold text-sm text-black dark:text-white font-poppins">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <button
                ref={trigger}
                type="button"
                onClick={() => {
                    if (!disabled) setIsOpen(!isOpen);
                }}
                className={`w-full dark:text-white  text-sm py-2.5 px-3 md:h-10 flex items-center justify-between rounded-lg text-left ${
                    value ? "dark:text-gray text-black" : "text-bodydark2"
                } ${disabled ? "bg-slate-200 cursor-default dark:bg-slate-800" : "bg-transparent"}`}
            >
                {value || placeholder}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M12 13.75C12.9665 13.75 13.75 12.9665 13.75 12C13.75 11.0335 12.9665 10.25 12 10.25C11.0335 10.25 10.25 11.0335 10.25 12C10.25 12.9665 11.0335 13.75 12 13.75Z" className="fill-black dark:fill-white" />
                    <path d="M19 13.75C19.9665 13.75 20.75 12.9665 20.75 12C20.75 11.0335 19.9665 10.25 19 10.25C18.0335 10.25 17.25 11.0335 17.25 12C17.25 12.9665 18.0335 13.75 19 13.75Z" className="fill-black dark:fill-white" />
                    <path d="M5 13.75C5.9665 13.75 6.75 12.9665 6.75 12C6.75 11.0335 5.9665 10.25 5 10.25C4.0335 10.25 3.25 11.0335 3.25 12C3.25 12.9665 4.0335 13.75 5 13.75Z" className="fill-black dark:fill-white" />
                </svg>
            </button>

            {isOpen &&
                ReactDOM.createPortal(
                    <div
                        className="bg-white dark:bg-black dark:text-white  border border-stroke max-h-42 overflow-y-auto rounded-lg shadow-lg transition-all opacity-100"
                           
                        style={dropdownStyles}
                    >
                        {data?.map((option, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelect(option)}
                                className={`py-2 px-4 cursor-pointer text-sm hover:bg-green-100 dark:hover:bg-boxdark2 rounded-md ${
                                    value === option ? "bg-gray-100 dark:bg-boxdark2" : ""
                                }`}
                                style={{
                                    height: "40px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {option}
                            </div>
                        ))}
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default PointSelect;
