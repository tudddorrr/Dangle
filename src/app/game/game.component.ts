import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api/api.service';
import { NewEventComponent } from '../new-event/new-event.component';
import { ViewEventComponent } from '../view-event/view-event.component';
import { MdDialog } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  id: string;
  paramSub: any;
  game: any;
  date: Date = new Date();
  events: CalendarEvent<any>[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService, public dialog: MdDialog) { }

  ngOnInit() {
    this.paramSub = this.route.params.subscribe(params => {
      this.id = params['id'];

      this.api.get('game?id=' + this.id).subscribe(data => {
        this.game = data;
      });

      this.api.get('events?id=' + this.id).subscribe(data => {
        this.events = data.map(event => {
          return {
            start: new Date(event.start),
            end: new Date(event.end),
            title: event.title,
            color: {
              primary: event.color.primary,
              secondary: event.color.secondary
            }
          }
        });
      }, err => {
        console.log(err);
      });
    });
  }

  ngOnDestroy() {
    this.paramSub.unsubscribe();
  }

  goHome() {
    this.router.navigateByUrl('/', { skipLocationChange: true })
  }

  dayClicked(day) {
    this.openViewDialog(day);
  }

  openCreateDialog(day) {
    let dialogRef = this.dialog.open(NewEventComponent, { data: { day: day, gameid: this.id } });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event) {
        this.pushEvent(result.event);
      }
    });
  }

  openViewDialog(day) {
    let dialogRef = this.dialog.open(ViewEventComponent, { data: {day: day, events: this.events} });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.create) {
        this.openCreateDialog(day);
      }
    });
  }

  pushEvent(event) {
    this.events.push(event);

    this.events = this.events.map(event => {
      return {
        start: new Date(event.start),
        end: new Date(event.end),
        title: event.title,
        color: {
          primary: event.color.primary,
          secondary: event.color.secondary
        }
      }
    });
    // console.log(event);
    // this.refresh.next();
  }
}
