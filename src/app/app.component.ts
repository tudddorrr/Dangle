import { Component } from '@angular/core';
import * as _ from 'lodash';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  games: any[] = [];

  constructor(private api: ApiService) {
    this.api.get('games').subscribe(data => {
      this.games = data;

      // fill up remaining spaces
      let fillCards = this.games.length%4;
      if(fillCards!==0) {
        //for(let i=0; i<fillCards; i++) this.games.push({name: '???', desc: '???', image: 'assets/img/shiba2.jpg', tags: []});
      }
    })
  }

  getTags(index: number): string[] {
    let MAX_TAGS: number = 3;
    if(this.games[index].tags.length<=MAX_TAGS) {
      return this.games[index].tags;
    } else {
      let remainingTags = this.games[index].tags.length-3;
      let displayedTags: string[] = this.games[index].tags.slice(0, 3).concat(['+' + remainingTags + ' more']);
      return displayedTags;
    }
  }
}
