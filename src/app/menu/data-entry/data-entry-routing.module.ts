import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataEntryPage } from './data-entry.page';

const routes: Routes = [
  {
    path: '',
    component: DataEntryPage,
    children: [
      {
        path: 'deceased',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./deceased-details/deceased-details.module').then(
                (m) => m.DeceasedDetailsPageModule
              ),
          },
          {
            path: 'new',
            loadChildren: () =>
              import('./deceased-details/add-new/add-new.module').then(
                (m) => m.AddNewPageModule
              ),
          },
          {
            path: 'edit/:deceasedId',
            loadChildren: () =>
              import(
                './deceased-details/edit-details/edit-details.module'
              ).then((m) => m.EditDetailsPageModule),
          },
          {
            path: 'view/:deceasedId',
            loadChildren: () =>
              import(
                './deceased-details/deceased-information/deceased-information.module'
              ).then((m) => m.DeceasedInformationPageModule),
          },
        ],
      },
      {
        path: 'invoicing',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./invoicing/invoicing.module').then(
                (m) => m.InvoicingPageModule
              ),
          },
          {
            path: 'new',
            loadChildren: () =>
              import('./invoicing/create-invoice/create-invoice.module').then(
                (m) => m.CreateInvoicePageModule
              ),
          },
          {
            path: 'edit/:invoiceId',
            loadChildren: () =>
              import('./invoicing/edit-invoice/edit-invoice.module').then(
                (m) => m.EditInvoicePageModule
              ),
          },
          {
            path: 'view/:invoiceId',
            loadChildren: () =>
              import(
                './invoicing/invoice-information/invoice-information.module'
              ).then((m) => m.InvoiceInformationPageModule),
          },
        ],
      },
      {
        path: 'cemetery-list',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./cemetery-list/cemetery-list.module').then(
                (m) => m.CemetryListPageModule
              ),
          },
          {
            path: 'new',
            loadChildren: () =>
              import('./cemetery-list/new-cemetery/new-cemetery.module').then(
                (m) => m.NewCemetryPageModule
              ),
          },
          {
            path: 'edit/:cemeteryId',
            loadChildren: () =>
              import('./cemetery-list/edit-cemetery/edit-cemetery.module').then(
                (m) => m.EditCemetryPageModule
              ),
          },
        ],
      },
      {
        path: 'church-list',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./church-list/church-list.module').then(
                (m) => m.ChurchListPageModule
              ),
          },
        ],
      },
      {
        path: '',
        redirectTo: '/menu/tabs/data-entry/deceased',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/menu/tabs/data-entry/deceased',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataEntryPageRoutingModule {}
