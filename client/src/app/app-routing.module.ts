import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HotelComponent } from "./hotel/hotel.component";
import { RoomComponent } from "./room/room.component";
import { GuestComponent } from "./guest/guest.component";
import { AnimalComponent } from "./animal/animal.component";
import { FactureComponent } from "./facture/facture.component";

const routes: Routes = [
  { path: "app", component: AppComponent },
  { path: "animals", component: AnimalComponent },
  { path: "factures", component: FactureComponent },
  { path: "rooms", component: RoomComponent },
  { path: "hotels", component: HotelComponent },
  { path: "guests", component: GuestComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }