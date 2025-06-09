import { Component, viewChild, ViewContainerRef, input, effect, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FieldConfig } from '../models/form-config.model';
import { FormFieldRegistryService } from '../services/form-field-registry.service';

@Component({
  selector: 'emr-field-loader',
  standalone: true,
  template: `<ng-container #anchor></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldLoaderComponent {
  fieldConfig = input.required<FieldConfig>();
  control = input.required<AbstractControl>();
  anchor = viewChild.required('anchor', { read: ViewContainerRef });

  constructor(private registry: FormFieldRegistryService) {
    effect(async () => {
      const fieldConfig = this.fieldConfig();
      const control = this.control();
      const anchor = this.anchor();

      anchor.clear();

      const importer = this.registry.getImporter(fieldConfig.type);
      if (importer) {
        try {
          const componentType = await importer();
          const componentRef = anchor.createComponent(componentType);
          componentRef.setInput('control', control);
          componentRef.setInput('fieldConfig', fieldConfig);
        } catch (error) {
          console.error(`Error loading component for type "${fieldConfig.type}":`, error);
        }
      }
    });
  }
}
