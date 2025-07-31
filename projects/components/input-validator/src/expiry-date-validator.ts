import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function expiryDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    if (!value || value.length !== 4) {
      return null;
    }

    const month = parseInt(value.substring(0, 2), 10);
    const year = parseInt(value.substring(2, 4), 10);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = parseInt(currentDate.getFullYear().toString().substring(2, 4));

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { expiryDateInPast: true };
    }

    return null;
  };
}
