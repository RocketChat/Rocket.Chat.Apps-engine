export interface IDepartment {
    id: string;
    name?: string;
    email?: string;
    enabled: boolean;
    updatedAt: Date;
    numberOfAgents: number;
    showOnOfflineForm: boolean;
    showOnRegistration: boolean;
}
