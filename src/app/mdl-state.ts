import {MdlCommand} from './mdl-command';

export class MdlState {
  id: string;
  role: string;
  bgColor: string;
  bgImage: string;
  fgColor: string;
  fgText: string[];
  fgTextFilled: string[];
  commands: MdlCommand[];

  imdbTitle: string;
  imdbId: string;

  variableRx: string;
  variableName: string;
  variableErrMsg: string;

  cutSceneShowMs: number;
}
