import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api/api.service';
import { NewEventComponent } from '../new-event/new-event.component';
import { ViewEventsComponent } from '../view-events/view-events.component';
import { MdDialog } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { Subject } from 'rxjs/Subject';
import { ReportEditComponent } from 'app/report-edit/report-edit.component';
import { Thread } from './chat';
import { SnackbarService } from '../services/snackbar/snackbar.service';

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
  threads: Thread[] = [];
  newThread: boolean;
 
  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService, public dialog: MdDialog, private snackbar: SnackbarService) { }

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
            },
            meta: {
              note: event.meta.note
            }
          }
        });
      }, err => {
        console.log(err);
      });

      this.api.get('threads?id=' + this.id).subscribe(data => {
        this.threads = data.threads;
      })
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
    let dialogRef = this.dialog.open(ViewEventsComponent, { data: {day: day, events: this.events} });

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
        },
        meta: {
          note: event.meta.note
        }
      }
    });
  }

  handleBannerError(event) {
    event.target.src = '../../assets/img/unknown.png';
  }

  openReportEditDialog() {
    let dialogRef = this.dialog.open(ReportEditComponent, { data: {game: this.game} });
  }

  toggleNewThread() {
    this.newThread = !this.newThread;
  }

  addNewThread(event) {
    this.api.post('thread', {
      title: event.title,
      name: event.name,
      date: new Date(),
      text: event.text,
      gameid: this.game.id
    }).subscribe(data => {
      if(data.success) {
        this.threads.unshift(data.thread);
        this.toggleNewThread();        
      } else {
        this.snackbar.create(data.msg);
      }
    });
  }
}
