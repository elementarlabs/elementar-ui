import { Component, computed, input, output, ChangeDetectionStrategy, Signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { FormConfig, LayoutNode, GridNode, FieldConfig } from '../models/form-config.model';
import { FormGeneratorService } from '../services/form-generator.service';
import { FieldLoaderComponent } from '../field-loader/field-loader.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'emr-form-renderer',
  exportAs: 'emrFormRenderer',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatNativeDateModule,
    FieldLoaderComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './form-renderer.component.html',
  styleUrl: './form-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-form-renderer',
  }
})
export class FormRendererComponent {
  readonly config = input.required<FormConfig>();

  protected formGroup: Signal<FormGroup> = computed(() =>
    this.formGenerator.createFormGroup(this.config().fields)
  );
  private fieldsMap: Signal<Map<string, FieldConfig>> = computed(() => {
    const map = new Map<string, FieldConfig>();
    for (const field of this.config().fields) {
      map.set(field.name, field);
    }
    return map;
  });

  readonly formSubmit = output<any>();

  constructor(private formGenerator: FormGeneratorService) {
    this.formGroup = computed(() =>
      this.formGenerator.createFormGroup(this.config().fields)
    );
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

  protected onSubmit() {
    this.submit();
  }

  submit(): void {
    const form = this.formGroup();
    if (form.valid) {
      this.formSubmit.emit(form.value);
    } else {
      form.markAllAsTouched();
    }
  }
}
