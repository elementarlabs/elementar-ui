import { Component, ViewContainerRef, input, effect, computed, viewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ComponentConfig } from '../models/form-config.model';
import { ComponentRegistryService } from '../services/component-registry.service';

@Component({
  selector: 'emr-component-loader',
  exportAs: 'emrComponentLoader',
  standalone: true,
  templateUrl: './component-loader.component.html',
  host: {
    '[style.grid-column]': 'gridColumnStyle()',
  }
})
export class ComponentLoaderComponent {
  componentConfig = input.required<ComponentConfig>();
  control = input<FormControl | null>(null);
  colspan = input<number | undefined>();

  protected gridColumnStyle = computed(() => {
    const span = this.colspan();
    return span ? `span ${span}` : null;
  });

  anchor = viewChild.required('anchor', { read: ViewContainerRef });

  constructor(private registry: ComponentRegistryService) {
    effect(async () => {
      const config = this.componentConfig();
      const control = this.control();
      const vcr = this.anchor();
      vcr.clear();
      const importer = this.registry.getImporter(config.type);

      if (importer) {
        try {
          const componentType = await importer();
          const componentRef = vcr.createComponent(componentType);

          componentRef.setInput('config', config);

          if (control) {
            componentRef.setInput('control', control);
          }
        } catch (error) {
          console.error(`Error loading component for type "${config.type}":`, error);
        }
      }
    });
  }
}
