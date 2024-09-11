import { InputHTMLAttributes, SelectHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  placeholder?: string;
  className?: string;
  rounded?: "full" | "medium" | "large" | "none";
  error?: string | null;
  rows?: number;
  cols?: number;
  label: string;
  value?: string | number | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export interface InputUserSearchInterface {
  placeholder?: string;
  className?: string;
  rounded?: "full" | "medium" | "large" | "none";
  label?: string;
  userSelected: {
    id: string | undefined;
    name: string;
    email: string;
  }[];
  setUserSelected: Function;
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
  rounded?: "full" | "medium" | "large" | "none";
  className?: string;
  required?: boolean;
  initialValue?: string;
}

export interface InputSelectprops
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  placeholder?: string;
  data: Array<string>;
  value?: string;
  onValueChange: (selectedValue: string) => void;
  required?: boolean;
  className?: string;
}

export type CheckBoxProp = {
  label: string;
  htmlFor?: string;
  checked?: boolean;
  onStateCheckChange?: (checked: boolean) => void;
  active?: boolean | number;
};
