import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { ApiService } from '../services/api/api.service';
import { SnackbarService } from '../services/snackbar/snackbar.service';

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
  tagInput: string;
  tags: string[] = [];
  platforms: boolean[] = [false, false, false];
  platformNames: string[] = ['Windows', 'Mac', 'Linux'];

  constructor(public dialogRef: MdDialogRef<NewGameComponent>, private api: ApiService, private snackbar: SnackbarService) { }

  ngOnInit() {
  }

  addTag() {
    if(this.tagInput.length<=0) return;

    if(this.tags.indexOf(this.tagInput)!=-1) {
      this.snackbar.create('You\'ve already added this tag');
      return;
    }

    if(this.tagInput.indexOf(' ')!=-1) {
      this.snackbar.create('Tags can only be one-word long');
      return;
    }

    this.tags.push(this.tagInput.toLowerCase());
    this.tagInput = '';
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
      platforms: this.platforms
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
}
