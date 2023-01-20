export class MenuItem {
    constructor(
        public name: string,
        public description: string,
        public image: string,
        public url: string,
        public items: MenuItem[] = [],
        public type: "extentions" | "link" | "page" | "plugin" = "link",
    ) { }
}