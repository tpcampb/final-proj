import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, AfterViewChecked} from '@angular/core';
import {Subscription} from 'rxjs';
import {GameEngineService} from '../game-engine.service';
import {MdlState} from '../mdl-state';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss']
})
export class GameScreenComponent implements OnInit, AfterViewInit, AfterViewChecked {
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

  ngAfterViewChecked(){
    console.log('ngAfterViewChecked');
    if (!this.isCommandEntryDisabled()) {
      this.commandElement.nativeElement.focus();
    }
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

  public isCommandEntryDisabled(): boolean {
    return this.curState.role === 'cut scene';
  }

  private setCurState(state: MdlState) {
    if (state) {
      this.curState = state;
    }
  }
}
