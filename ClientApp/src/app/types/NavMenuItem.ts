export class NavMenuItem{
    constructor(
        public name: string,
        public description: string,
        public image: string,
        public url: string,
        public items: NavMenuItem[],
        public viewSubItems: boolean = false
    ){}
}