import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {GameEngineService} from '../game-engine.service';
import {MdlState} from '../mdl-state';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss']
})
export class GameScreenComponent implements OnInit {
  public curState: MdlState;
  private curStateSubscription: Subscription;
  constructor(private gameEngine: GameEngineService) {
    this.curState = this.gameEngine.getCurState();
    this.curStateSubscription = this.gameEngine.getCurStateObservable().subscribe(state => {
      this.curState = state;
    });
  }

  ngOnInit(): void {
  }

}
