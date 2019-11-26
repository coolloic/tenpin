export default class Device {
    cx?: number = 0;

    cy?: number = 0;

    point?: any = [0, 0];

    class?: string = '';

    r?: number = 0.1;

    fill?: string = '#fff';

    hulls?: [] = [];

    id?: string = Date.now().toString();

    text?: string = '';

    fontSize?: number = 10;

    visible?: boolean = false;

    links?: [] = [];

    filtered?: boolean = false;

    active?: boolean = false;

    event?: any;
}
