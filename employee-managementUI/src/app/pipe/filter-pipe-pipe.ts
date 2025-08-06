import { Pipe, PipeTransform } from '@angular/core';

interface Employee {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  department: string;
  role: string;
 }

@Pipe({ 
  name: 'filter',
  standalone: true
 })

 
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) return items;

    // If it's a string, use it directly
    let keyword = '';

    if (typeof searchText === 'string') {
      keyword = searchText;
    } else if (typeof searchText === 'object' && searchText !== null){
      //try extracting a known searchable string property
      const employee = searchText as Employee
      keyword = employee.firstName || employee.lastName || employee.username || employee.email || employee.role || employee.department || '';
    }

    //const lowerSearch = (searchText || '').toLowerCase();
    //const lowerSearch = searchText.toLowerCase();

    keyword = keyword.toString().toLowerCase();
    return items.filter(user =>
      user.username.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      user.firstName.toLowerCase().includes(keyword) || 
      user.lastName.toLowerCase().includes(keyword) ||
      user.department.toLowerCase().includes(keyword) ||
      user.role.toLowerCase().includes(keyword)
    );
  }
}
