import { ValidatorFn, AbstractControl } from '@angular/forms';

export type FieldType =
  | 'input'
  | 'textarea'
  | 'select'
  | 'datepicker'
  | 'autocomplete'
  | 'checkbox'
  | 'radio-group'
  | 'toggle'
  | 'slider';

export interface ValidatorConfig {
  type: string;
  value?: any;
  validator?: ValidatorFn;
  message: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  value?: any;
  placeholder?: string;
  inputType?: 'text' | 'number' | 'email' | 'password';
  options?: { value: any; label: string }[];
  validators?: ValidatorConfig[];
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  thumbLabel?: boolean;
  readonly?: boolean;
  disabled?: boolean;
}

export interface FieldNode {
  field: string;
  colspan?: number;
}

export interface GridNode {
  columns: number;
  gap?: string;
  children: LayoutNode[];
}

export type LayoutNode = FieldNode | GridNode;

export interface FormConfig {
  fields: FieldConfig[];
  layout: LayoutNode;
}

export interface IFormField {
  control: AbstractControl;
  fieldConfig: FieldConfig;
}
