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

  readonly initialValue = signal({
    userType: 'other',
    subscribe: true,
  });

  formConfig = signal<FormConfig>({
    elements: [
      {
        kind: 'field',
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
        kind: 'field',
        name: 'lastName',
        type: 'input',
        label: 'Last name',
        validators: [{ type: 'required', message: 'Last name is required' }]
      },
      {
        kind: 'field',
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
        kind: 'field',
        name: 'userType',
        type: 'select',
        label: 'User type',
        payload: {
          options: [
            { value: 'admin', label: 'Administrator' },
            { value: 'editor', label: 'Editor' },
            { value: 'other', label: 'Other' },
          ]
        }
      },
      {
        kind: 'field',
        name: 'bio',
        type: 'textarea',
        label: 'Biography',
        placeholder: 'Tell us about yourself...'
      },
      {
        kind: 'field',
        name: 'birthDate',
        type: 'datepicker',
        label: 'Date of birth'
      },
      {
        kind: 'field',
        name: 'gender',
        type: 'radioGroup',
        label: 'Gender',
        value: null,
        inline: true,
        hint: 'We will never share your email address with third parties.',
        payload: {
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' }
          ],
        },
        validators: [{
          type: 'required',
          message: 'Please specify your gender'
        }]
      },
      {
        kind: 'field',
        name: 'subscribe',
        type: 'checkbox',
        label: 'Subscribe to the newsletter',
        value: true
      },
      {
        kind: 'field',
        name: 'eula',
        type: 'toggle',
        label: 'Accept the terms of the EULA',
        value: false
      },
      {
        kind: 'field',
        name: 'timezone',
        type: 'timezone',
        label: 'Timezone',
        placeholder: 'Select timezone',
      },
      {
        kind: 'field',
        name: 'otherTypeDescription',
        type: 'input',
        label: 'Specify the type',
        validators: [{ type: 'required', message: 'This field is required if the type “Other” is selected.' }],
        visibleWhen: (form: FormGroup) => form.get('userType')?.value === 'other',
      },
      {
        kind: 'content',
        name: 'logoImage',
        type: 'image',
        content: {
          src: 'https://angular.io/assets/images/logos/angular/angular.svg',
          alt: 'Логотип Angular',
          width: 200,
        }
      },
      {
        kind: 'content',
        name: 'mainHeader',
        type: 'text',
        content: { htmlContent: '<h2>New User Registration</h2>' }
      },
    ],
    layout: {
      columns: 2,
      children: [
        { name: 'logoImage', colspan: 2 },
        { name: 'mainHeader', colspan: 2 },
        { name: 'firstName' },
        { name: 'lastName' },
        { name: 'email' },
        { name: 'userType' },
        { name: 'birthDate' },
        { name: 'timezone' },
        { name: 'subscribe' },
        { name: 'eula'},
        { name: 'bio', colspan: 2 },
        { name: 'otherTypeDescription' },
        { name: 'gender'},
      ]
    }
  });

  onFormSubmit(data: any) {
    this.submittedData.set(data);
  }
}
