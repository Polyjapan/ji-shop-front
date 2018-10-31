export class MenuItem {
  constructor(routerLink: string, text: string, icon: string, tag?: string, basePath?: string[]) {
    this.routerLink = routerLink;
    this.text = text;
    this.icon = icon;
    this.tag = tag;
    this.basePath = basePath;
  }

  routerLink: string;
  text: string;
  icon: string;
  tag: string;
  basePath: string[];

  get iconClass() {
    return 'feather fas fa-' + this.icon;
  }

  getTag() {
    return this.tag !== undefined ? this.tag : this.routerLink;
  }
}
