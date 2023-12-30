import {
    EventEmiter
} from './event_emmiter'

export class Events extends EventEmiter {

    constructor(settings) {
        super();
        this.events = {};
        this.settings = settings;


        this.loaded = () => this.emit("loaded");

    }

    run(){
        this.settings.apply()
    }
}