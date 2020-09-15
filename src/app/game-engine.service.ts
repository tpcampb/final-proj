import {Injectable} from '@angular/core';
import {MdlState} from './mdl-state';
import {Subject} from 'rxjs';
// @ts-ignore
// tslint:disable-next-line:import-spacing
import stateData from  '../assets/data/states.json';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  private allStates: MdlState[];
  private curState: MdlState;
  private curStateSubject: Subject<MdlState>;

  constructor() {
    this.curStateSubject = new Subject<MdlState>();
    this.init();
  }

  public init() {
    this.allStates = this.readAllStates();
    this.curState = this.allStates[0];
  }

  public getCurState(): MdlState {
    return this.curState;
  }

  public getCurStateObservable() {
    return this.curStateSubject.asObservable();
  }

  private readAllStates(): MdlState[] {
    return stateData;
    return null;
  }
}
