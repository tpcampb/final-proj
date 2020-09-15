import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MdlState} from './mdl-state';
import {GameEngineService} from './game-engine.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  title = 'EthicsTrail';
  curState: MdlState;
  private curStateSubscription: Subscription;

  constructor(private gameEngine: GameEngineService) {
    this.curStateSubscription = this.gameEngine.getCurStateObservable().subscribe(state => {
      this.setCurState(state);
    });
  }

  ngOnInit(): void {
  }

  private setCurState(state: MdlState) {
    if (state) {
      this.curState = state;
    }
  }
}
