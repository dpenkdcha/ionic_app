import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ApplicationFormComponent } from './application-form/application-form.component';
import { PersonalDetailsComponent } from './application-form/personal-details/personal-details.component';
import { ContactDetailsComponent } from './application-form/contact-details/contact-details.component';
import { FinancialDetailsComponent } from './application-form/financial-details/financial-details.component';
import { EducationDetailsComponent } from './application-form/education-details/education-details.component';
import { ProfessionalDetailsComponent } from './application-form/professional-details/professional-details.component';
import { AdditionalDetailsComponent } from './application-form/additional-details/additional-details.component';
import { DocumentUploadComponent } from './application-form/document-upload/document-upload.component';
import { CreateProspectComponent } from './create-prospect/create-prospect.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule) },
            { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
            { path: 'forms', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
            { path: 'bs-element', loadChildren: () => import('./bs-element/bs-element.module').then(m => m.BsElementModule) },
            { path: 'grid', loadChildren: () => import('./grid/grid.module').then(m => m.GridModule) },
            { path: 'components', loadChildren: () => import('./bs-component/bs-component.module').then(m => m.BsComponentModule) },
            { path: 'blank-page', loadChildren: () => import('./blank-page/blank-page.module').then(m => m.BlankPageModule) },
            { path: 'create-prospect', component: CreateProspectComponent },
            {
                path: 'application-form',
                component: ApplicationFormComponent,
                children: [
                    { path: '', redirectTo: 'personal-details', pathMatch: 'prefix' },
                    { path: 'personal-details', component: PersonalDetailsComponent },
                    { path: 'contact-details', component: ContactDetailsComponent },
                    { path: 'financial-details', component: FinancialDetailsComponent },
                    { path: 'education-details', component: EducationDetailsComponent },
                    { path: 'professional-details', component: ProfessionalDetailsComponent },
                    { path: 'additional-details', component: AdditionalDetailsComponent },
                    { path: 'document-upload', component: DocumentUploadComponent }
                ]
            }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
