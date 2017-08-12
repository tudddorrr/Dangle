import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  id: string;
  paramSub: any;
  game: any;

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) { }

  ngOnInit() {
    this.paramSub = this.route.params.subscribe(params => {
      this.id = params['id'];

      this.api.get('game?id=' + this.id).subscribe(data => {
        this.game = data;
      });
    });
  }

  ngOnDestroy() {
    this.paramSub.unsubscribe();
  }

  goHome() {
    this.router.navigateByUrl('/', { skipLocationChange: true })
  }
}
