import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material'

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
  tags: string[] = ['just', 'some', 'tags'];
  platforms: boolean[] = [false, false, false];
  platformNames: string[] = ['Windows', 'Mac', 'Linux'];

  constructor(public dialogRef: MdDialogRef<NewGameComponent>) { }

  ngOnInit() {
  }

  addTag() {
    if(this.tagInput.length<=0) return;

    this.tags.push(this.tagInput);
    this.tagInput = '';
  }

  removeTag(tag: string) {
    let index = this.tags.indexOf(tag);
    this.tags.splice(index, 1);
  }

  addGame() {
    console.log('name: ' + this.name);
    console.log(this.link);
    console.log(this.image);
    console.log(this.desc);
    console.log(this.platforms);
  }
}
