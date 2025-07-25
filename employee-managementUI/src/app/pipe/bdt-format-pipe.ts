import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bdtFormat'
})
export class BdtFormatPipe implements PipeTransform {

  transform(value: number): string {
    const formatted = new Intl.NumberFormat('en-Bd', {
      style: 'currency',
      currency: 'BDT',
      currencyDisplay: 'code'
    }).formatToParts(value);

    return formatted
              .map(part => part.type == 'currency' ? '৳' : part.value )
              .join('');
  }

}
