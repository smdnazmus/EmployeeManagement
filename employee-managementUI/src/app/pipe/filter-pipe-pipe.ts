import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ 
  name: 'filter',
  standalone: true
 })
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) return items;

    const lowerSearch = searchText.toLowerCase();
    return items.filter(user =>
      user.username.toLowerCase().includes(lowerSearch) ||
      user.email.toLowerCase().includes(lowerSearch) ||
      user.firstName.toLowerCase().includes(lowerSearch) || 
      user.lastName.toLowerCase().includes(lowerSearch) ||
      user.department.toLowerCase().includes(lowerSearch) ||
      user.role.toLowerCase().includes(lowerSearch)
    );
  }
}
