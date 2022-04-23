import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';

const PRIMENG_MODULES = [
  ButtonModule,
  CardModule,
  PanelMenuModule,
  MenubarModule,
  ToastModule
];

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule, PRIMENG_MODULES]
})
export class HomeModule {}
