import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { ApplicationFormComponent } from './application-form/application-form.component';
import { PersonalDetailsComponent } from './application-form/personal-details/personal-details.component';
import { ContactDetailsComponent } from './application-form/contact-details/contact-details.component';
import { FinancialDetailsComponent } from './application-form/financial-details/financial-details.component';
import { EducationDetailsComponent } from './application-form/education-details/education-details.component';
import { ProfessionalDetailsComponent } from './application-form/professional-details/professional-details.component';
import { AdditionalDetailsComponent } from './application-form/additional-details/additional-details.component';
import { DocumentUploadComponent } from './application-form/document-upload/document-upload.component';
import { CreateProspectComponent } from './create-prospect/create-prospect.component';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        TranslateModule,
        NgbDropdownModule
    ],
    declarations: [
        LayoutComponent,
        SidebarComponent,
        HeaderComponent,
        CreateProspectComponent,
        ApplicationFormComponent,
        PersonalDetailsComponent,
        ContactDetailsComponent,
        FinancialDetailsComponent,
        EducationDetailsComponent,
        ProfessionalDetailsComponent,
        AdditionalDetailsComponent,
        DocumentUploadComponent
    ]
})
export class LayoutModule { }
