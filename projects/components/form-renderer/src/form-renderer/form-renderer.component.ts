import {
  Component,
  computed,
  input,
  output,
  ChangeDetectionStrategy,
  Signal,
  inject,
  effect,
  OnDestroy
} from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { FormConfig, LayoutNode, GridNode, FieldConfig } from '../models/form-config.model';
import { FormGeneratorService } from '../services/form-generator.service';
import { NgTemplateOutlet } from '@angular/common';
import { ValidatorRegistryService } from '../services/validator-registry.service';
import { startWith, Subscription } from 'rxjs';
import { FieldLoaderComponent } from '../field-loader/field-loader.component';

@Component({
  selector: 'emr-form-renderer',
  exportAs: 'emrFormRenderer',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatNativeDateModule,
    NgTemplateOutlet,
    FieldLoaderComponent,
  ],
  templateUrl: './form-renderer.component.html',
  styleUrl: './form-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-form-renderer',
  }
})
export class FormRendererComponent implements OnDestroy {
  private validatorRegistry = inject(ValidatorRegistryService);
  private formGenerator = inject(FormGeneratorService);

  readonly config = input.required<FormConfig>();

  readonly formGroup: Signal<FormGroup> = computed(() =>
    this.formGenerator.createFormGroup(this.config().fields)
  );
  private fieldsMap: Signal<Map<string, FieldConfig>> = computed(() => {
    const map = new Map<string, FieldConfig>();
    for (const field of this.config().fields) {
      map.set(field.name, field);
    }
    return map;
  });
  private valueChangesSub?: Subscription;

  readonly formSubmit = output<any>();

  constructor() {
    effect(() => {
      this.valueChangesSub?.unsubscribe();
      const form = this.formGroup();
      this.valueChangesSub = form.valueChanges
        .pipe(
          startWith(form.value)
        )
        .subscribe(() => {
          for (const fieldConfig of this.config().fields) {
            const control = form.get(fieldConfig.name);

            if (!control) {
              continue;
            }

            const isVisible = fieldConfig.visibleWhen ? fieldConfig.visibleWhen(form) : true;
            const shouldBeEnabled = !(fieldConfig.disabled ?? false) && isVisible;

            if (shouldBeEnabled && control.disabled) {
              control.enable({ emitEvent: false });
              const validators = this.mapValidators(fieldConfig);
              control.setValidators(validators);
            } else if (!shouldBeEnabled && control.enabled) {
              control.disable({ emitEvent: false });
              control.clearValidators();
            }
            control.updateValueAndValidity({ emitEvent: false });
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.valueChangesSub?.unsubscribe();
  }

  getFieldConfig(name: string): FieldConfig | undefined {
    return this.fieldsMap().get(name);
  }

  getControl(name: string): FormControl {
    return this.formGroup().get(name) as FormControl;
  }

  isGridNode(node: LayoutNode): node is GridNode {
    return 'children' in node;
  }

  isFieldVisible(fieldName: string): boolean {
    const fieldConfig = this.fieldsMap().get(fieldName);
    if (!fieldConfig?.visibleWhen) {
      return true;
    }
    return fieldConfig.visibleWhen(this.formGroup());
  }

  private mapValidators(fieldConfig: FieldConfig): ValidatorFn[] {
    if (!fieldConfig.validators) {
      return [];
    }
    return fieldConfig.validators.map(config => this.validatorRegistry.getValidator(config));
  }

  submit(): void {
    const form = this.formGroup();
    if (form.valid) {
      this.formSubmit.emit(form.getRawValue());
    } else {
      form.markAllAsTouched();
    }
  }

  protected onSubmit() {
    this.submit();
  }
}
