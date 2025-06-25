import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchByProperty',
})
export class SearchByPropertyPipe implements PipeTransform {
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  transform<T>(items: T[] | null, propPath: string, searchValue: string): T[] {
    if (!items) {
      return [];
    }
    if (!searchValue) {
      return items;
    }

    const lowercasedSearchValue = searchValue.toLowerCase();

    return items.filter(item => {
      const propertyValue = this.getNestedValue(item, propPath);

      if (typeof propertyValue === 'string') {
        return propertyValue.toLowerCase().includes(lowercasedSearchValue);
      }

      return false;
    });
  }
}
