import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByProperty',
})
export class FilterByPropertyPipe implements PipeTransform {
  transform<T>(items: T[] | null, propName: keyof T, searchText: string): T[] {
    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }

    const lowercasedSearchText = searchText.toLowerCase();

    return items.filter(item => {
      const propertyValue = item[propName];

      if (propertyValue && typeof propertyValue === 'string') {
        return propertyValue.toLowerCase().includes(lowercasedSearchText);
      }

      if (propertyValue && typeof propertyValue === 'number') {
        return propertyValue.toString().toLowerCase().includes(lowercasedSearchText);
      }

      return false;
    });
  }
}
