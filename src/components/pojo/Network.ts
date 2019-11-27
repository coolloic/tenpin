import Device from '@/components/pojo/Device.ts';

export default class Network {
  id?: string = Date.now().toString();

  center?: any = [0, 0];

  class?: string = '';

  stroke?: string = '#fff';

  fill?: string = '#000';

  d?: string = '';

  x?: number = 0;

  y?: number = 0;

  text?: string = '';

  counter?: number = 0;

  d0?: string = '';

  // default circle path
  data?: Array<Device>;

  expanded?: boolean = false;

  filtered?: boolean = false;

  strokeWidth?: number = 1;

  highlight?: boolean = false;

  fontSize?: number = 10;

  level?: number = 1;

  geometry?: any;

  toppoint?: any = [0, 0];

  multiSelected?: boolean = false;

  points?: any;

  event?: any;
}
