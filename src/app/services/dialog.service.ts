import { Injectable } from '@angular/core';
import { Dialogs } from '@nativescript/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  alert(title: string, message: string): Promise<void> {
    return Dialogs.alert({
      title: title,
      message: message,
      okButtonText: 'OK'
    });
  }

  confirm(title: string, message: string): Promise<boolean> {
    return Dialogs.confirm({
      title: title,
      message: message,
      okButtonText: 'Sí',
      cancelButtonText: 'No'
    });
  }

  prompt(title: string, message: string, defaultText: string): Promise<Dialogs.PromptResult> {
    return Dialogs.prompt({
      title: title,
      message: message,
      okButtonText: 'OK',
      cancelButtonText: 'Cancelar',
      defaultText: defaultText,
      inputType: Dialogs.inputType.decimal
    });
  }
}