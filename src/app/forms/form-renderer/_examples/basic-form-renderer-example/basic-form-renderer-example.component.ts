import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { FormConfig, FormRendererComponent, ValidatorRegistryService } from '@elementar-ui/components/form-renderer';
import { JsonPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-basic-form-renderer-example',
  imports: [
    FormRendererComponent,
    JsonPipe,
    MatButton
  ],
  templateUrl: './basic-form-renderer-example.component.html',
  styleUrl: './basic-form-renderer-example.component.scss'
})
export class BasicFormRendererExampleComponent {
  readonly submittedData = signal(null);

  constructor() {
    const validatorRegistry = inject(ValidatorRegistryService);
    validatorRegistry.registerValidator('forbiddenDomain', (config) => {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value as string;
        if (value && value.endsWith(`@${config.value}`)) {
          return { forbiddenDomain: { domain: config.value } };
        }
        return null;
      };
    });
  }

  formConfig = signal<FormConfig>({
    fields: [
      {
        name: 'firstName',
        type: 'input',
        label: 'Name',
        value: 'Name',
        validators: [
          { type: 'required', message: 'Name is required' },
          { type: 'minLength', value: 2, message: 'Minimum 2 characters' }
        ]
      },
      {
        name: 'lastName',
        type: 'input',
        label: 'Last name',
        validators: [{ type: 'required', message: 'Last name is required' }]
      },
      {
        name: 'email',
        type: 'input',
        inputType: 'email',
        label: 'Email',
        hint: 'We will never share your email address with third parties.',
        validators: [
          { type: 'required', message: 'Email is required' },
          { type: 'email', message: 'Enter a valid email address' },
          { type: 'forbiddenDomain', value: 'test.com', message: 'Email on the test.com domain is prohibited.' }
        ]
      },
      {
        name: 'userType',
        type: 'select',
        label: 'User type',
        value: 'editor',
        options: [
          { value: 'admin', label: 'Administrator' },
          { value: 'editor', label: 'Editor' },
          { value: 'other', label: 'Other' },
        ]
      },
      {
        name: 'bio',
        type: 'textarea',
        label: 'Biography',
        placeholder: 'Tell us about yourself...'
      },
      {
        name: 'birthDate',
        type: 'datepicker',
        label: 'Date of birth'
      },
      {
        name: 'gender',
        type: 'radioGroup',
        label: 'Gender',
        value: null,
        inline: true,
        hint: 'We will never share your email address with third parties.',
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' }
        ],
        validators: [{
          type: 'required',
          message: 'Please specify your gender'
        }]
      },
      {
        name: 'subscribe',
        type: 'checkbox',
        label: 'Subscribe to the newsletter',
        value: true
      },
      {
        name: 'eula',
        type: 'toggle',
        label: 'Accept the terms of the EULA',
        value: false
      },
      {
        name: 'timezone',
        type: 'timezone',
        label: 'Timezone',
        placeholder: 'Select timezone',
      },
      {
        name: 'otherTypeDescription',
        type: 'input',
        label: 'Specify the type',
        validators: [{ type: 'required', message: 'This field is required if the type “Other” is selected.' }],
        visibleWhen: (form: FormGroup) => form.get('userType')?.value === 'other',
      },
    ],
    layout: {
      columns: 2,
      children: [
        { field: 'firstName' },
        { field: 'lastName' },
        { field: 'email' },
        { field: 'userType' },
        { field: 'birthDate' },
        { field: 'timezone' },
        { field: 'subscribe' },
        { field: 'eula'},
        { field: 'bio', colspan: 2 },
        { field: 'otherTypeDescription' },
        { field: 'gender'},
      ]
    }
  });

  onFormSubmit(data: any) {
    this.submittedData.set(data);
  }
}
