//import { environment } from 'src/environments/environment.dev.ts'; // Adjust for prod later
import { environment } from "../../environments/environment.dev";  // adjust later for prod 

// 👥 Get all employees
export const getEmployees = async () => {
  const response = await fetch(`${environment.apiBaseUrl}/api/employees`);
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  return response.json();
};

// ➕ Create a new employee
export const createEmployee = async (employeeData: any) => {
  const response = await fetch(`${environment.apiBaseUrl}/api/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employeeData)
  });

  if (!response.ok) {
    throw new Error('Failed to create employee');
  }
  return response.json();
};
