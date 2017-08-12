import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ApiService } from '../services/api/api.service';
import { MdDialog } from '@angular/material';
import { NewGameComponent } from '../new-game/new-game.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  games: any[] = [];
  search: string = '';
  maxTags: number = 3;

  constructor(private api: ApiService, public dialog: MdDialog, private router: Router) {
    this.api.get('games').subscribe(data => {
      this.games = data;
    })
  }

  ngOnInit() { }

  getGames(): any[] {
    for (let game of this.games) {
      game.shown = true;
    }

    if (this.search.length > 0) {
      if (this.search.indexOf('#') != -1) {
        // search by tags (todo multiple tags)
        let searchTag = this.search.substring(1, this.search.length).toLowerCase();

        for (let i = 0; i < this.games.length; i++) {
          if (this.games[i].tags.indexOf(searchTag) == -1) this.games[i].shown = false;
        }
      } else {
        // search by name
        for (let i = 0; i < this.games.length; i++) {
          if (!this.games[i].name.includes(this.search.toLowerCase())) this.games[i].shown = false;
        }
      }
    }

    return _.filter(this.games, { shown: true });
  }

  getTags(game: any): string[] {
    if (!game.tags) return [];

    if (game.tags.length <= this.maxTags) {
      return game.tags;
    } else {
      let remainingTags = game.tags.length - 3;
      let displayedTags: string[] = game.tags.slice(0, 3).concat(['+' + remainingTags + ' more']);
      return displayedTags;
    }
  }

  openDialog() {
    let dialogRef = this.dialog.open(NewGameComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.game) {
        this.games.push(result.game);
      }
    });
  }

  isMoreTag(tag: string): boolean {
    return tag.indexOf(' more')!=-1;
  }

  searchByTag(tag: string, game: any) {
    if (this.isMoreTag(tag)) {
      this.clickGame(game);
      return;
    }

    this.search = '#' + tag;
  }

  clickGame(game: any) {
    this.router.navigateByUrl('/game/' + game.id, { skipLocationChange: true });
  }
}
