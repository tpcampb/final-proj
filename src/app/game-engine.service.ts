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
  private variableMap: Map<string, number>;
  private scenarios: string[];
  private scenarioInd: number;

  constructor() {
    this.curStateSubject = new Subject<MdlState>();
    this.init();
    this.moveToStateById(this.nextScenarioStateId());
  }

  public init() {
    this.initMetrics();
    this.allStates = this.readAllStates();
    this.scenarios = [
      'S-01',
      'S-10',
      'S-20',
      'S-30',
      'S-40',
      'S-50'
    ];
    this.scenarioInd = -1;
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
    this.variableMap = new Map<string, number>();
    this.variableMap.set('d', 5);
    this.variableMap.set('u', 5);
    this.variableMap.set('p', 5);
    this.variableMap.set('e', 5);
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

  private executeTransition(transition: MdlTransition): MdlState {
    this.addMetricPoints('d', transition.dPoints);
    this.addMetricPoints('u', transition.uPoints);
    this.addMetricPoints('p', transition.pPoints);
    this.addMetricPoints('e', transition.ePoints);

    let nextStateId = transition.stateId;
    if (transition.stateId === 'END-STATE') {
      nextStateId = this.nextScenarioStateId();
    }
    if (transition.stateId === 'END-GAME') {
      this.init();
      nextStateId = this.nextScenarioStateId();
    }

    const nextState = this.moveToStateById(nextStateId);
    const nextStateTransition = this.getFirstStateTransition(nextState);

    if (nextStateTransition.sound) {
      this.playAudio(nextStateTransition.sound);
    }

    if (this.curState.role === 'cut scene') {
      setTimeout(() => {
        return this.executeTransition(nextStateTransition);
      }, this.curState.cutSceneShowMs);
    }

    return nextState;
  }

  private moveToStateById(id: string): MdlState {
    const nextState = this.allStates.find(s => s.id === id);
    return this.moveToState(nextState);
  }

  private moveToState(nextState: MdlState): MdlState {
    this.fillFgText(nextState);
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

  private fillFgText(nextState: MdlState) {
    if (!nextState) {
      return;
    }

    let tempText = nextState.fgText;
    if (tempText) {
      tempText = tempText.map(line => {
        return this.insertVarIntoLine(line);
      });
    }

    nextState.fgTextFilled = tempText;
    // var re = /\s*([^[:]+):\"([^"]+)"/g;
    // var s = '[description:"aoeu" uuid:"123sth"]';
    // var m;
    //
    // do {
    //   m = re.exec(s);
    //   if (m) {
    //     console.log(m[1], m[2]);
    //   }
    // } while (m);
  }

  private insertVarIntoLine(line: string): string {
    let retVal = line;
    let m = null;
    // const re = /{{(?<var>\w{1,15})}}/g;
    const re = new RegExp('{{(?<var>\\w{1,15})}}', 'g');
    do {
      m = re.exec(line);
      if (m) {
        console.log(m);
        console.log(m.groups.var);
        const v = m.groups.var;
        if (this.variableMap.has(v)) {
          retVal = retVal.replace('{{' + v + '}}', this.variableMap.get(v).toString());
        }

        retVal = retVal;
      }
    } while (m);

    return retVal;
  }

  private nextScenarioStateId() {
    this.scenarioInd += 1;

    if (this.scenarioInd >= this.scenarios.length) {
      return 'S-990';
    } else {
      return this.scenarios[this.scenarioInd];
    }
  }

  private listGameVars() {
    for (const [key, value] of this.variableMap) {
      console.log(key + ' = ' + value);
    }
  }

  private playAudio(sound: string) {
    const audio = new Audio();
    audio.src = sound;
    audio.load();
    audio.play();
  }
}
