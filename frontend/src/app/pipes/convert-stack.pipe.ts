import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertStack',
  standalone: true
})
export class ConvertStackPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
