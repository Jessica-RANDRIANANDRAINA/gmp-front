import { ITitleEffort } from "./Project";
export interface CardDropDownProps {
  title: string;
  primaryColor?: string;
  value?: number;
  startDate?: string | undefined;
  endDate?: string | undefined;
  activity?: ITitleEffort[];
}
