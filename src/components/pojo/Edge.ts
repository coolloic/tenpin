import Device from '@/components/pojo/Device.ts';
import {Layer} from '@/components/pojo/Enums.ts';

export default class Edge {
  id?: string = Date.now().toString();

  class?: string = '';

  d?: string = '';

  strokeWidth?: number = 1;

  source?: Device = {};

  target?: Device = {};

  layer?: Layer = Layer.PHYSICAL;

  arrow?: string = '';

  visible?: boolean = false;

  text?: string = '';

  x1?: number = 0;

  y1?: number = 0;

  x2?: number = 0;

  y2?: number = 0;

  arc?: number = 0;

  bidirectional?: boolean = true;

  filtered?: boolean = false;

  hulls?: Set<string>;

  highlight?: boolean = false;

  icons?: any = [];
}
