export interface TableAccessProps {
  data: Array<{
    id: string;
    label: string;
    admin: string[];
    project: string[];
    transverse: string[];
    intercontract: string[];
  }>;
}
