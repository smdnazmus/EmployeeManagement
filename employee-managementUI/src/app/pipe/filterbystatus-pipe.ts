import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterbystatus'
})
export class FilterbystatusPipe implements PipeTransform {

  transform(leaves: any[], status: string): any[] {
    if (!leaves || status === 'All') {
      return leaves;
    }
    return leaves.filter(leave => leave.status === status);
  }

}
