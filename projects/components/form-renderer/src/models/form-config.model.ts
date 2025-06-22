import { FormGroup, ValidationErrors } from '@angular/forms';

export interface ValidatorConfig {
  type: string;
  value?: any;
  message: string;
}

interface BaseComponentConfig {
  name: string;
  type: string;
}

export interface FormFieldConfig extends BaseComponentConfig {
  kind: 'field';
  value?: any;
  validators?: ValidatorConfig[];
  label?: string;
  placeholder?: string;
  inputType?: 'text' | 'number' | 'email' | 'password';
  readonly?: boolean;
  disabled?: boolean;
  inline?: boolean;
  visibleWhen?: (formGroup: FormGroup) => boolean;
  payload?: {
    [key: string]: any;
  };
  hint?: string;
}

export interface ContentConfig extends BaseComponentConfig {
  kind: 'content';
  content?: {
    [key: string]: any;
  };
}

export type ComponentConfig = FormFieldConfig | ContentConfig | any;

export interface ComponentNode {
  name: string;
  colspan?: number;
}

export interface GridNode {
  columns: number;
  gap?: string;
  children: LayoutNode[];
}

export type LayoutNode = ComponentNode | GridNode;

export type CrossValidatorFn = (formGroup: FormGroup) => ValidationErrors | null;

export interface FormConfig {
  elements: ComponentConfig[];
  layout: LayoutNode;
  crossValidators?: CrossValidatorFn[];
}
