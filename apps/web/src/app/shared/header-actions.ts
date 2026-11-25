import { Injectable, signal, type TemplateRef } from '@angular/core';

@Injectable({providedIn:'root'})
export class HeaderActions {
  readonly template = signal<TemplateRef<unknown> | undefined>(undefined);
}
