import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {GameEngineService} from '../game-engine.service';
import {MdlState} from '../mdl-state';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss']
})
export class GameScreenComponent implements OnInit, AfterViewInit {
  @ViewChild('commandElement') commandElement: ElementRef;

  private curStateSubscription: Subscription;
  public curState: MdlState;
  public curCommand = '';

  constructor(private gameEngine: GameEngineService) {
    this.curState = this.gameEngine.getCurState();
    this.curStateSubscription = this.gameEngine.getCurStateObservable().subscribe(state => {
      this.setCurState(state);
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.commandElement.nativeElement.focus();
  }

  public processCommand() {
    const command = this.curCommand;
    this.curCommand = '';
    this.gameEngine.executeCommand(command);

    // const audio = new Audio();
    // audio.src = 'assets/sound/warm-snow-by-XYLENE.mp3';
    // audio.load();
    // audio.play();
  }

  private setCurState(state: MdlState) {
    if (state) {
      this.curState = state;
    }
  }
}
