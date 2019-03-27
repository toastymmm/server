import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'ellipsis'
})
export class EllipsisFilter implements PipeTransform {
  transform(value: string, args: string): string {
    const limit = parseInt(args, 10);
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
