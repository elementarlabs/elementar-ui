import { Component, inject, signal } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
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
        label: 'Имя',
        defaultValue: 'Иван',
        validators: [
          { type: 'required', message: 'Имя обязательно' },
          { type: 'minLength', value: 2, message: 'Минимум 2 символа' }
        ]
      },
      {
        name: 'lastName',
        type: 'input',
        label: 'Фамилия',
        validators: [{ type: 'required', message: 'Фамилия обязательна' }]
      },
      {
        name: 'email',
        type: 'input',
        inputType: 'email',
        label: 'Email',
        validators: [
          { type: 'required', message: 'Email обязателен' },
          { type: 'email', message: 'Введите корректный Email' },
          { type: 'forbiddenDomain', value: 'test.com', message: 'Email на домене test.com запрещен' }
        ]
      },
      {
        name: 'userType',
        type: 'select',
        label: 'Тип пользователя',
        defaultValue: 'editor',
        options: [
          { value: 'admin', label: 'Администратор' },
          { value: 'editor', label: 'Редактор' },
          { value: 'guest', label: 'Гость' },
        ]
      },
      {
        name: 'bio',
        type: 'textarea',
        label: 'Биография',
        placeholder: 'Расскажите о себе...'
      },
      {
        name: 'birthDate',
        type: 'datepicker',
        label: 'Дата рождения'
      },
      {
        name: 'subscribe',
        type: 'checkbox',
        label: 'Подписаться на рассылку',
        defaultValue: true
      },
      {
        name: 'eula',
        type: 'toggle',
        label: 'Принять условия EULA',
        defaultValue: false
      }
    ],
    layout: {
      columns: 2,
      gap: '16px 24px',
      children: [
        { field: 'firstName' },
        { field: 'lastName' },
        { field: 'email' },
        { field: 'userType' },
        { field: 'bio', colspan: 2 },
        { field: 'birthDate' },
        { field: 'subscribe' },
        { field: 'eula'}
      ]
    }
  });

  onFormSubmit(data: any) {
    this.submittedData.set(data);
  }
}
