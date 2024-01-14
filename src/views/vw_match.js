import { BaseView } from "./base_view";
import { Evolution } from "../models/evolution";

export class Match extends BaseView {
    constructor(screen) {
        super("match", screen);
        this.spaces = [];
        this.prices = [];
        this.names = [];
        this.solved = false;
        this.victory_sound = null;
        this.__loadMusic();
        this._normalize();
    }
    __loadMusic() {
        this.victory_sound = this.__insertSoundObject(
            this.config.flawless_victory_sound
        );
    }

    _normalize() {
        for (var i = 0; i < this.screen.product_list.length; i++) {
            this.spaces.push(this.screen.product_list[i].space);
            this.prices.push(this.screen.product_list[i].price);
            this.names.push(this.screen.product_list[i].name);
        }
    }

    onLoad() {
        var self = this;
        this.solved = false;
        this.screen.ai = null;
        this.victory_sound.currentTime = 0;
        this.victory_sound.play();

        setTimeout(() => {
            self.initAI();
        }, 10);
    }

    onClose() {}

    update() {
        this._drawGameOver();
    }

    initAI() {
        this.screen.ai = new Evolution(this.screen,this.config.population_size);
        console.log(this);
        this.screen.ai.solve(
            this.config.mutation_probability,
            this.config.number_of_generations,
            this.spaces,
            this.prices,
            this.screen.evolution_limit
        );
        this.solved = true;
    }

    _drawGameOver() {
        var ctx = this.getContext();
        ctx.save();
        ctx.font = "18px Arial";
        var text = "GAME OVER";
        var y = 29;
        var x =
            Math.round(this.screenWidth() / 2) -
            ctx.measureText(text).width / 2;
        ctx.fillStyle = "white";
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    _drawScoreOfLucy(){


    }

    _drawScoreOfEvolution(){
        
    }
}
