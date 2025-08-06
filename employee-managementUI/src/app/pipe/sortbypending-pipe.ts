import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortbypending'
})
export class SortbypendingPipe implements PipeTransform {

  transform(leaves: any[]): any[] {
    if (!leaves) {
      return [];
    }

    return [...leaves].sort((a, b) => {
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (a.status !== 'Pending' && b.status === 'Pending') return 1;

      return 0;
    });
  }

}
