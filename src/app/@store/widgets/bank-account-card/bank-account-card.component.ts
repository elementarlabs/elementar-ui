import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD } from '@elementar-ui/components/dashboard';

@Component({
  selector: 'emr-bank-account-card',
  imports: [],
  templateUrl: './bank-account-card.component.html',
  styleUrl: './bank-account-card.component.scss'
})
export class BankAccountCardComponent implements OnInit {
  private _dashboard = inject<any>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
