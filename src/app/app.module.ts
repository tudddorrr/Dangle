import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import 'hammerjs';
import { ApiService } from './services/api/api.service';
import { NewGameComponent } from './new-game/new-game.component';
import { SnackbarService } from './services/snackbar/snackbar.service'
import { GameComponent } from './game/game.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CalendarModule } from 'angular-calendar';
import { NewEventComponent } from './new-event/new-event.component';
import { ViewEventsComponent } from './view-events/view-events.component';
import { ReportEditComponent } from './report-edit/report-edit.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game/:id', component: GameComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    NewGameComponent,
    GameComponent,
    HomeComponent,
    NewEventComponent,
    ViewEventsComponent,
    ReportEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    RouterModule.forRoot(routes),
    CalendarModule.forRoot(),
    ReactiveFormsModule
  ],
  entryComponents: [
    NewGameComponent,
    NewEventComponent,
    ViewEventsComponent,
    ReportEditComponent
  ],
  providers: [ApiService, SnackbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
