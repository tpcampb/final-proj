import {Injectable} from '@angular/core';
import {MdlState} from './mdl-state';
import {Subject} from 'rxjs';
// @ts-ignore
// tslint:disable-next-line:import-spacing
import stateData from  '../assets/data/states.json';
import {MdlCommand} from './mdl-command';
import {MdlTransition} from './mdl-transition';

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

  public executeCommand(command: string): MdlState {
    if (this.curState.role === 'variable') {
      return this.executeVariableCommand(command);
    }

    for (const c of this.curState.commands) {
      if (c.key === command || c.key === '*') {
        const transition = this.nominateStateTransition(c);
        return this.executeTransition(transition);
      }
    }

    // if (nextState.delayedAction) {
    //   setTimeout(() => {
    //     console.log('fire delay');
    //     this.moveToStateById(nextState.delayedAction.stateId);
    //   }, nextState.delayedAction.delayMs);
    // }

    // todo::no valid command entered
    return this.curState;
  }

  private readAllStates(): MdlState[] {
    return stateData;
  }

  private executeVariableCommand(command: string): MdlState {
    // if (this.curState.variableRx) {
    //   console.log('Input does not match requirements');
    //   const rxValid = new RegExp(this.curState.variableRx);
    //   console.log(rxValid.test(command));
    //   if (rxValid.test(command)) {
    //     this.variableMap.set(this.curState.variableName, command);
    //     return this.moveToStateById(this.curState.nextStateId);
    //   }
    // }
    return this.curState;
  }

  private moveToStateById(id: string): MdlState {
    const nextState = this.allStates.find(s => s.id === id);
    return this.moveToState(nextState);
  }

  private moveToState(nextState: MdlState): MdlState {
    this.curState = nextState;
    this.curStateSubject.next(this.curState);
    return this.curState;
  }

  private nominateStateTransition(command: MdlCommand) {
    const val = Math.random();
    console.log('rand value = ' + val);
    let totalChance = 0;
    for (const t of command.transitions) {
      totalChance += t.chance;
      if (val < totalChance) {
        return t;
      }
    }
    return command.transitions[0];
  }

  private executeTransition(transition: MdlTransition): MdlState {
    // todo::added points
    // todo::process actions
    return this.moveToStateById(transition.stateId);
  }
}
