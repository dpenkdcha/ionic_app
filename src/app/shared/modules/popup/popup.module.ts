import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { PopupComponent } from 'src/app/shared/modules/popup/popup.component';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule],
    declarations: [PopupComponent],
    bootstrap: [PopupComponent]
})
export class PopupModule {
    
}