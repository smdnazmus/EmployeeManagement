export interface PayrollRecord {
    id: number;
    employeeId: number;
    payDate: string;
    baseSalary: number;
    bonus: number;
    deductions: number;
    netPay?: number;
    status: string;
    user: string;
    updatedOn: Date;
}