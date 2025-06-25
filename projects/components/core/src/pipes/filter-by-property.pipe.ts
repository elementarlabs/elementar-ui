import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByProperty',
})
export class FilterByPropertyPipe implements PipeTransform {
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  transform<T>(items: T[], propPath: string, value: any, strict = false): T[] {
    if (!items) {
      return [];
    }

    if (value === undefined || typeof value === 'undefined') {
      return items;
    }

    if (!strict && (value === null || value === '')) {
      return items;
    }

    return items.filter(item => {
      const propertyValue = this.getNestedValue(item, propPath);
      return propertyValue === value;
    });
  }
}
