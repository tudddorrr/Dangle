import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, DialogPosition } from '@angular/material';
import { ApiService } from '../services/api/api.service';
import { SnackbarService } from '../services/snackbar/snackbar.service';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit {
  name: string;
  link: string;
  image: string;
  desc: string;
  tags: string[] = [];
  platforms: boolean[] = [];

  tagCtrl: FormControl = new FormControl();
  filteredTags: any;

  maxCommunityLinks: number = 4;
  communityTypes: string[] = ['Discord', 'Steam Group', 'Forum', 'Subreddit', 'Other']
  communityLinks: any[] = [{type: '', link: ''}];

  nsfw: boolean;

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<NewGameComponent>, private api: ApiService, private snackbar: SnackbarService) {
    this.filteredTags = this.tagCtrl.valueChanges
    .startWith(null)
    .map(name => this.filterTags(name));

    for(let platform in api.platformNames) this.platforms.push(false);
  }

  ngOnInit() {
  }

  addTag(tagVal) {
    if(tagVal.length<=0) return;

    if(this.tags.indexOf(tagVal)!=-1) {
      this.snackbar.create('You\'ve already added this tag');
      return;
    }

    if(tagVal.indexOf(' ')!=-1) {
      this.snackbar.create('Tags can only be one-word long');
      return;
    }

    this.tags.push(tagVal.toLowerCase());
    this.tagCtrl.setValue('');
  }

  removeTag(tag: string) {
    let index = this.tags.indexOf(tag);
    this.tags.splice(index, 1);
  }

  addGame() {
    let gameData: any = {
      name: this.name,
      link: this.link,
      desc: this.desc,
      tags: this.tags,
      platforms: this.platforms,
      communityLinks: this.communityLinks,
      nsfw: this.nsfw
    }

    this.api.post('game', gameData).subscribe(data => {
      if(!data.success) {
        let snackBarRef = this.snackbar.create(data.msg);
      } else {
        this.dialogRef.close({game: data.game});
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  filterTags(val: string): any[] {
    if(!val || val.length<1) return [];

    return val ? this.data.tags.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
               : this.data.tags;
  }

  addCommunityLink() {
    this.communityLinks.push({type: '', link: ''});
  }
}
