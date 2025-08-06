export interface LeaveReq {
    id?: number; // optional
    employeeId: number;
    employeeName?: string;
    leaveType: string;
    startDate: Date;
    endDate: Date;
    reason: string;
    status?: string;
}