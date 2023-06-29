import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {HomeComponent} from "./components/home/home.component";
import {CreatePlacesComponent} from "./components/create-places/create-places.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {AboutComponent} from "./components/about/about.component";

const routes: Routes = [
  {path:'',redirectTo:'/home',pathMatch:"full"},
  {path:'home',component:HomeComponent},
  {path:'add-new-place',component:CreatePlacesComponent},
  {path:'about',component:AboutComponent},
  {path:'**',component:PageNotFoundComponent,pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
