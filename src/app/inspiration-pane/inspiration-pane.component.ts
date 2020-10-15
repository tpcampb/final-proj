import { Component, OnInit } from '@angular/core';
import {MdlState} from '../mdl-state';
import {Subscription} from 'rxjs';
import {GameEngineService} from '../game-engine.service';
import {ImdbInfo} from '../imdb-info';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-inspiration-pane',
  templateUrl: './inspiration-pane.component.html',
  styleUrls: ['./inspiration-pane.component.scss']
})
export class InspirationPaneComponent implements OnInit {
  public curState: MdlState;
  public imdbInfo: ImdbInfo;
  private curStateSubscription: Subscription;
  private lastImdbInfo: string;

  constructor(private gameEngine: GameEngineService, private http: HttpClient) {
    this.setCurrentState(this.gameEngine.getCurState());
    this.curStateSubscription = this.gameEngine.getCurStateObservable().subscribe(state => {
      this.setCurrentState(state);
    });
  }

  ngOnInit(): void {
  }

  private setCurrentState(state: MdlState) {
    this.curState = state;

    if (this.curState.imdbId === this.lastImdbInfo) {
      return;
    }

    this.imdbInfo = null;
    if (this.curState.imdbId) {
      this.lastImdbInfo = this.curState.imdbId;
      const url = 'https://www.omdbapi.com/?apikey=c755c6&i=' + this.curState.imdbId;
      console.log(url);
      this.http.get<ImdbInfo>(url)
        .subscribe((data) => {
          console.log('received data');
          console.log(data);
          this.imdbInfo = data;
        });
    }
  }
}
