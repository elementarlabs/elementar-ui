import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByProperty',
})
export class FilterByPropertyPipe implements PipeTransform {
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  transform<T>(items: T[] | null, propPath: string, value: any, strict = false): T[] {
    if (!strict && !value) {
      return [];
    }

    if (!items) {
      return [];
    }

    if (value === null || value === undefined || value === '') {
      return items;
    }

    return items.filter(item => {
      const propertyValue = this.getNestedValue(item, propPath);
      return propertyValue === value;
    });
  }
}
