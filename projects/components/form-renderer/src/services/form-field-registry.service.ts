import { Injectable, Type } from '@angular/core';

type FieldComponentImporter = () => Promise<Type<any>>;

@Injectable({
  providedIn: 'root',
})
export class FormFieldRegistryService {
  private fieldComponentMap = new Map<string, FieldComponentImporter>();

  constructor() {
    this.registerDefaultFields();
  }

  private registerDefaultFields(): void {
    this.fieldComponentMap.set('input', () =>
      import('../fields/input-field/input-field.component').then(c => c.InputFieldComponent)
    );
    this.fieldComponentMap.set('textarea', () =>
      import('../fields/textarea-field/textarea-field.component')
        .then(c => c.TextareaFieldComponent)
    );
    this.fieldComponentMap.set('select', () =>
      import('../fields/select-field/select-field.component')
        .then(c => c.SelectFieldComponent)
    );
    this.fieldComponentMap.set('checkbox', () =>
      import('../fields/checkbox-field/checkbox-field.component')
        .then(c => c.CheckboxFieldComponent)
    );
    this.fieldComponentMap.set('datepicker', () =>
      import('../fields/datepicker-field/datepicker-field.component')
        .then(c => c.DatepickerFieldComponent)
    );
    this.fieldComponentMap.set('toggle', () =>
      import('../fields/toggle-field/toggle-field.component')
        .then(c => c.ToggleFieldComponent)
    );
    this.fieldComponentMap.set('radioGroup', () =>
      import('../fields/radio-group-field/radio-group-field.component')
        .then(c => c.RadioGroupFieldComponent)
    );
    this.fieldComponentMap.set('timezone', () =>
      import('../fields/timezone-field/timezone-field.component')
        .then(c => c.TimezoneFieldComponent)
    );
  }

  registerField(typeName: string, importer: FieldComponentImporter): void {
    this.fieldComponentMap.set(typeName, importer);
  }

  getImporter(typeName: string): FieldComponentImporter | undefined {
    return this.fieldComponentMap.get(typeName);
  }
}
