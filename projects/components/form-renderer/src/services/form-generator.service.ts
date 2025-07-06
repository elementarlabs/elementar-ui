import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { FormConfig, ValidatorConfig } from '../models/form-config.model';
import { ValidatorRegistryService } from './validator-registry.service';

@Injectable({
  providedIn: 'root',
})
export class FormGeneratorService {
  constructor(
    private fb: FormBuilder,
    private validatorRegistry: ValidatorRegistryService
  ) {}

  createFormGroup(config: FormConfig, initialValue?: Record<string, any>): FormGroup {
    const group = this.fb.group({}, { validators: config.crossValidators });

    for (const elementConfig of config.elements) {
      if (elementConfig.kind === 'field') {
        let finalValue = initialValue?.[elementConfig.name] ?? elementConfig.value ?? null;

        if (finalValue === null && 'defaultValue' in elementConfig) {
          finalValue = elementConfig.defaultValue;
        }

        const validators = this.mapValidators(elementConfig.validators);
        const formState = {
          value: finalValue,
          disabled: elementConfig.disabled ?? false
        };
        const control = new FormControl(formState, validators);
        group.addControl(elementConfig.name, control);
      }
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
