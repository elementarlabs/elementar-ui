import { Injectable } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { ValidatorConfig } from '../models/form-config.model';

type ValidatorFactory = (config: ValidatorConfig) => ValidatorFn;

@Injectable({
  providedIn: 'root',
})
export class ValidatorRegistryService {
  private validatorMap = new Map<string, ValidatorFactory>();

  constructor() {
    this.registerDefaultValidators();
  }

  private registerDefaultValidators(): void {
    this.registerValidator('required', () => Validators.required);
    this.registerValidator('email', () => Validators.email);
    this.registerValidator('minLength', (config) => Validators.minLength(config.value));
    this.registerValidator('maxLength', (config) => Validators.maxLength(config.value));
    this.registerValidator('pattern', (config) => Validators.pattern(config.value));
    this.registerValidator('custom', (config) => config.validator!);
  }

  registerValidator(name: string, factory: ValidatorFactory): void {
    this.validatorMap.set(name, factory);
  }

  getValidator(config: ValidatorConfig): ValidatorFn {
    const factory = this.validatorMap.get(config.type);
    if (!factory) {
      return Validators.nullValidator;
    }
    return factory(config);
  }
}
