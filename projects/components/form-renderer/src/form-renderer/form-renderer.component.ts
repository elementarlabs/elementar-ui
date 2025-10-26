import {
  Component,
  computed,
  input,
  output,
  ChangeDetectionStrategy,
  Signal,
  effect,
  OnDestroy,
  OnInit, inject, DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { ComponentConfig, FormConfig, LayoutNode, GridNode, ValidatorConfig } from '../models/form-config.model';
import { FormGeneratorService } from '../services/form-generator.service';
import { ComponentLoaderComponent } from '../component-loader/component-loader.component';
import { ValidatorRegistryService } from '../services/validator-registry.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'emr-form-renderer',
  exportAs: 'emrFormRenderer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatNativeDateModule,
    ComponentLoaderComponent,
  ],
  templateUrl: './form-renderer.component.html',
  styleUrl: './form-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-form-renderer',
  }
})
export class FormRendererComponent implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);

  readonly config = input.required<FormConfig>();
  readonly initialValue = input<Record<string, any> | undefined>();
  readonly formSubmit = output<any>();
  readonly valueChanges = output<any>();
  readonly initialized = output<void>();

  private elementsMap: Signal<Map<string, ComponentConfig>> = computed(() => {
    const map = new Map<string, ComponentConfig>();
    for (const element of this.config().elements) {
      map.set(element.name, element);
    }
    return map;
  });

  protected formGroup: Signal<FormGroup> = computed(() =>
    this.formGenerator.createFormGroup(this.config(), this.initialValue())
  );

  #initialized = false;
  private valueChangesSub?: Subscription;

  constructor(
    private formGenerator: FormGeneratorService,
    private validatorRegistry: ValidatorRegistryService
  ) {
    effect(() => {
      this.valueChangesSub?.unsubscribe();
      const form = this.formGroup();
      this.valueChangesSub = form.valueChanges
        .pipe(
          startWith(form.value),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          for (const elementConfig of this.config().elements) {
            if (elementConfig.kind === 'field') {
              const control = form.get(elementConfig.name);

              if (!control) {
                continue;
              }

              const isVisible = elementConfig.visibleWhen ? elementConfig.visibleWhen(form) : true;
              const shouldBeEnabled = !(elementConfig.disabled ?? false) && isVisible;

              if (shouldBeEnabled && control.disabled) {
                control.enable({ emitEvent: false });
                const validators = this.mapValidators(elementConfig.validators);
                control.setValidators(validators);
              } else if (!shouldBeEnabled && control.enabled) {
                control.disable({ emitEvent: false });
                control.clearValidators();
              }

              control.updateValueAndValidity({ emitEvent: false });
            }
          }

          if (!this.#initialized) {
            this.#initialized = true;
            this.initialized.emit();
          }
        });
    });
  }

  ngOnInit() {
    const form = this.formGroup();
    form
      .valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.#initialized) {
          return;
        }

        this.valueChanges.emit(form.value);
      });
  }

  ngOnDestroy(): void {
    this.valueChangesSub?.unsubscribe();
  }

  submit() {
    const form = this.formGroup();
    if (form.valid) {
      this.formSubmit.emit(form.getRawValue());
    } else {
      form.markAllAsTouched();
    }
  }

  get form() {
    return this.formGroup();
  }

  get value() {
    return this.formGroup().value;
  }

  get isValid() {
    return this.form.valid;
  }

  get isInvalid() {
    return this.form.invalid;
  }

  protected isFieldVisible(name: string): boolean {
    const componentConfig = this.elementsMap().get(name);
    if (!componentConfig) {
      return true;
    }

    if (componentConfig.kind === 'field' && componentConfig.visibleWhen) {
      return componentConfig.visibleWhen(this.formGroup());
    }

    return true;
  }

  protected getComponentConfig(name: string): ComponentConfig | undefined {
    return this.elementsMap().get(name);
  }

  protected getControl(name: string): FormControl | null {
    return this.formGroup().get(name) as FormControl | null;
  }

  protected isGridNode(node: LayoutNode): node is GridNode {
    return 'children' in node;
  }

  protected onSubmit(): void {
    this.submit();
  }

  private mapValidators(validators: ValidatorConfig[] | undefined): ValidatorFn[] {
    if (!validators) {
      return [];
    }

    return validators.map(config => this.validatorRegistry.getValidator(config));
  }
}
