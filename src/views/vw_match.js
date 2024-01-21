import { BaseView } from "./base_view";
import { Evolution } from "../models/evolution";
import { ScorePanel } from "../models/score_panel";
import { Button } from "../models/button";

export class Match extends BaseView {
    constructor(screen) {
        super("match", screen);
        this.spaces = [];
        this.prices = [];
        this.names = [];
        this.solved = false;
        this.victory_sound = null;
        this.lucy_score = null;
        this.ai_score = null;
        this.am_i_win = false;
        this.inspect_button = null;
        this.play_again_button = null;
        this.score_panel = new ScorePanel(this, 30, 55, 210, 50);
        this.__injectButtons();
        this.__loadMusic();
        this._normalize();
    }

    __injectButtons() {
        var y = 115;
        var padding = 10;
        var w = 92;
        var h = 12;
        var total_w = w * 2 + padding;
        var x = this.screenWidth() / 2 - total_w / 2;

        this.play_again_button = new Button(
            this.screen,
            "PLAY AGAIN",
            "#E53935",
            "#f7eeed",
            x,
            y,
            w,
            h
        );
        this.inspect_button = new Button(
            this.screen,
            "INSPECT",
            "#22b324",
            "#f7eeed",
            x + padding + w,
            y,
            w,
            h
        );
        this._loadEvents();
    }

    _loadEvents() {
        var self = this;

        this.inspect_button.onClick = () => {
            self.__inspectGame();
        };

        this.play_again_button.onClick = () => {
            self.__playAgain();
        };

        document.addEventListener(
            "keyup",
            function (e) {
                self.__checkKeyUp(e);
            },
            true
        );
        this.inspect_button.hide();
        this.play_again_button.hide();
    }

    __inspectGame() {}

    __playAgain() {       
        this.screen.setView("inventory");
    }

    __checkKeyUp(e) {
        if (!this.isCurrentScene()) return;
        e = e || window.event;
        switch (e.keyCode) {
            case 27:
                this.__playAgain();
                break;
            case 13:
                this.__inspectGame();
                break;
            case 46:
                this.__playAgain();
                break;
        }
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
        this.lucy_score = this.screen.score;
        this.ai_score = null;
        this.play_again_button.visible();
        this.inspect_button.visible();
        setTimeout(() => {
            self.initAI();
        }, 10);
    }

    onClose() {
        this.play_again_button.hide();
        this.inspect_button.hide();
    }

    update() {
        this._drawGameOver();
        if (!this.solved) return;
        this._drawWinner();
    }

    initAI() {
        this.screen.ai = new Evolution(
            this.screen,
            this.config.population_size
        );
        this.screen.ai.solve(
            this.config.mutation_probability,
            this.config.number_of_generations,
            this.spaces,
            this.prices,
            this.screen.evolution_limit
        );
        this.ai_score = this.screen.ai.score;
        this.am_i_win = this.ai_score.amIWin(this.lucy_score);
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

    _drawWinner() {
        var text = "YOU " + (this.am_i_win ? "WIN" : "LOSE");
        var ctx = this.getContext();
        ctx.save();
        ctx.font = "12px Arial";

        var y = 45;
        var x =
            Math.round(this.screenWidth() / 2) -
            ctx.measureText(text).width / 2;
        ctx.fillStyle = this.am_i_win ? "green" : "red";
        ctx.fillText(text, x, y);
        ctx.restore();
        this.score_panel.update();
        this.__drawButtons();
    }

    __drawButtons() {
        this.inspect_button.update();
        this.play_again_button.update();
    }
}
