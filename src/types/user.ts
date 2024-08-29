export interface AssignHabilitationProps {
    userIds: string[], 
    habilitationIds: string[]
}

export interface UserInterface {
    id: string; 
    name: string; 
    email: string; 
    department: string; 
    poste: string; 
    superiorId: string | null;
    status: string; 
    hanilitations: Array<{id: string; label: string}>
}

export interface AuthContextProps {
    user: UserInterface | null; 
    login: (userData: UserInterface) => void; 
    logout: () => void;
}