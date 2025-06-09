import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { FieldConfig, ValidatorConfig } from '../models/form-config.model';
import { ValidatorRegistryService } from './validator-registry.service';

@Injectable({
  providedIn: 'root',
})
export class FormGeneratorService {
  constructor(
    private fb: FormBuilder,
    private validatorRegistry: ValidatorRegistryService
  ) {}

  createFormGroup(fields: FieldConfig[]): FormGroup {
    const group = this.fb.group({});
    for (const fieldConfig of fields) {
      const validators = this.mapValidators(fieldConfig.validators);
      const control = new FormControl(
        fieldConfig.defaultValue ?? null,
        validators
      );
      group.addControl(fieldConfig.name, control);
    }
    return group;
  }

  private mapValidators(validators: ValidatorConfig[] | undefined): ValidatorFn[] {
    if (!validators) {
      return [];
    }
    return validators.map(config => this.validatorRegistry.getValidator(config));
  }
}
