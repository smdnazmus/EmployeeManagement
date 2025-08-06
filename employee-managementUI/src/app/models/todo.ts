export interface ToDo {
    id?: number;
    title: string;
    dueDate: Date;
    createdBy: string;
    isDone?: boolean;
}