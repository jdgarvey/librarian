import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from './users.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [UsersService],
  declarations: []
})
export class CoreModule { }
