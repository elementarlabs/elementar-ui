import { Injectable, Type } from '@angular/core';

type ComponentImporter = () => Promise<Type<any>>;

@Injectable({
  providedIn: 'root',
})
export class ComponentRegistryService {
  private componentMap = new Map<string, ComponentImporter>();

  constructor() {
    this.registerDefaultComponents();
  }

  private registerDefaultComponents(): void {
    this.componentMap.set('input', () =>
      import('../fields/input-field/input-field.component').then(c => c.InputFieldComponent)
    );
    this.componentMap.set('textarea', () =>
      import('../fields/textarea-field/textarea-field.component')
        .then(c => c.TextareaFieldComponent)
    );
    this.componentMap.set('select', () =>
      import('../fields/select-field/select-field.component')
        .then(c => c.SelectFieldComponent)
    );
    this.componentMap.set('checkbox', () =>
      import('../fields/checkbox-field/checkbox-field.component')
        .then(c => c.CheckboxFieldComponent)
    );
    this.componentMap.set('datepicker', () =>
      import('../fields/datepicker-field/datepicker-field.component')
        .then(c => c.DatepickerFieldComponent)
    );
    this.componentMap.set('toggle', () =>
      import('../fields/toggle-field/toggle-field.component')
        .then(c => c.ToggleFieldComponent)
    );
    this.componentMap.set('radioGroup', () =>
      import('../fields/radio-group-field/radio-group-field.component')
        .then(c => c.RadioGroupFieldComponent)
    );
    this.componentMap.set('timezone', () =>
      import('../fields/timezone-field/timezone-field.component')
        .then(c => c.TimezoneFieldComponent)
    );
    this.componentMap.set('image', () =>
      import('../content/image-content/image-content.component')
        .then(c => c.ImageContentComponent));
    this.componentMap.set('text', () =>
      import('../content/text-content/text-content.component')
        .then(c => c.TextContentComponent));
    this.componentMap.set('divider', () =>
      import('../content/divider-content/divider-content.component')
        .then(c => c.DividerContentComponent));
  }

  getImporter(typeName: string): ComponentImporter | undefined {
    return this.componentMap.get(typeName);
  }
}
