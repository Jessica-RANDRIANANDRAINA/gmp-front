export interface TableAccessProps {
    data: Array<{
        id: string, 
        label: string, 
        visuel: string, 
        management: string, 
        department: string[]
    }>;
}

