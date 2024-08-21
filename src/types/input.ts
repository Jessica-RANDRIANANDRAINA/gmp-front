import { InputHTMLAttributes, SelectHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  placeholder?: string;
  className?: string;
  rounded?: "full" | "medium" | "large" | "none";
  error?: string | null;
  label: string;
}

export interface OptionMultiSelect {
  value: string;
  text: string;
  selected: boolean;
  element?: HTMLElement;
}

export interface MultiSelectProps {
  label: string | null;
  value?: Array<string>;
  setValueMulti: Function;
  id: string;
  placeholder?: string;
}


export interface InputSelectprops extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  placeholder?: string;
  data: Array<string>;
  value?: string;
  onValueChange: (selectedValue: string) => void;
  required?: boolean
  className?: string
};