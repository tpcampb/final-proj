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
  private variableMap;

  constructor() {
    this.curStateSubject = new Subject<MdlState>();
    this.init();
  }

  public init() {
    this.allStates = this.readAllStates();
    this.curState = this.allStates[0];
    this.initMetrics();
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
    return this.curState;
  }

  private readAllStates(): MdlState[] {
    return stateData;
  }

  private initMetrics() {
    this.variableMap = new Map();
    this.variableMap.set('d', 0);
    this.variableMap.set('u', 0);
    this.variableMap.set('p', 0);
    this.variableMap.set('e', 0);
  }

  private executeVariableCommand(command: string): MdlState {
    // TODO::warn user if input does not match requirements
    const state = this.curState;
    if (state.variableRx) {
      const rxValid = new RegExp(state.variableRx);

      if (!rxValid.test(command)) {
        console.log(state.variableErrMsg);
        return state;
      }
    }

    this.setGameVar(state.variableName, command);
    return this.executeTransition(this.getFirstStateTransition(state));
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

  private nominateStateTransition(command: MdlCommand): MdlTransition {
    const val = Math.random();
    let totalChance = 0;
    for (const t of command.transitions) {
      totalChance += t.chance;
      if (val < totalChance) {
        return t;
      }
    }
    return command.transitions[0];
  }

  private getFirstStateTransition(state: MdlState) {
    return state.commands[0].transitions[0];
  }

  private executeTransition(transition: MdlTransition): MdlState {
    this.addMetricPoints('d', transition.dPoints);
    this.addMetricPoints('u', transition.uPoints);
    this.addMetricPoints('p', transition.pPoints);
    this.addMetricPoints('e', transition.ePoints);

    const nextState = this.moveToStateById(transition.stateId);

    if (this.curState.role === 'cut scene') {
      setTimeout(() => {
        return this.executeTransition(this.getFirstStateTransition(nextState));
      }, this.curState.cutSceneShowMs);
    }
    return nextState;
  }

  private addMetricPoints(type: string, amount: number) {
    const curAmount = this.getGameVar(type);
    this.setGameVar(type, curAmount + amount);
  }

  private setGameVar(key: string, value: any) {
    this.variableMap.set(key, value);
  }

  private getGameVar(key: string): any {
    return this.variableMap.get(key);
  }

  private listGameVars() {
    for (const [key, value] of this.variableMap) {
      console.log(key + ' = ' + value);
    }
  }
}
