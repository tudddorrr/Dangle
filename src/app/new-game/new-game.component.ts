import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material'

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<NewGameComponent>) { }

  ngOnInit() {
  }

}
