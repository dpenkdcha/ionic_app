import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlankPageRoutingModule } from './blank-page-routing.module';
import { BlankPageComponent } from './blank-page.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, BlankPageRoutingModule, ReactiveFormsModule],
    declarations: [BlankPageComponent]
})
export class BlankPageModule {}
