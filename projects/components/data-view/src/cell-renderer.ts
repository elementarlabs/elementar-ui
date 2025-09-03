import { DataViewCellRenderer } from './types';

export function cellRenderer<T>(dataRenderer: string, component: any): DataViewCellRenderer {
  return {
    dataRenderer,
    component
  }
}
