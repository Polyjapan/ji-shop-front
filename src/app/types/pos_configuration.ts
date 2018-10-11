import {PosConfigItem} from './items';

export class PosConfiguration {
  id: number;
  name: string;
}

export class PosGetConfigResponse {
  config: PosConfiguration;
  items: PosConfigItem[];
}
