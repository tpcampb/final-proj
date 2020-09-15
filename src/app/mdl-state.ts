import {MdlCommand} from './mdl-command';

export class MdlState {
  id: string;
  role: string;
  bgColor: string;
  fgColor: string;
  fgText: string[];
  commands: MdlCommand[];

  imdbTitle: string;
  imdbId: string;

  variableRx: string;
  variableName: string;
}
