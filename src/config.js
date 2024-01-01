export class Config {
    constructor() {
        this.canvas_id = "earth";
        this.width = "100%";
        this.height = "100%";
        this.init = false;
        this.fps = 24;
        this.product_list=[];
        this.container_image =
            "https://assets.humanvsevolution.com/cargo_game/container.webp";
        this.city_sound =
            "https://assets.humanvsevolution.com/cargo_game/city_sound.wav";
        this.ambicent_crow_sound =
            "https://assets.humanvsevolution.com/cargo_game/ambicent_crow.wav";
        this.drop_sound =
            "https://assets.humanvsevolution.com/cargo_game/drop.wav";
        this.error_sound =
            "https://assets.humanvsevolution.com/cargo_game/error_sound.wav";
        this.key_press_sound =
            "https://assets.humanvsevolution.com/cargo_game/key_press.wav";
        this.modal_open_sound =
            "https://assets.humanvsevolution.com/cargo_game/modalopen.wav";
        this.mouse_click_sound =
            "https://assets.humanvsevolution.com/cargo_game/mouseclick.wav";
        this.mouse_hover_sound =
            "https://assets.humanvsevolution.com/cargo_game/mousehover.wav";
        this.mouse_leave_sound =
            "https://assets.humanvsevolution.com/cargo_game/mouseleave.wav";
        this.rain_sound =
            "https://assets.humanvsevolution.com/cargo_game/rain_sound.mp3";
        this.user_monkey =
            "https://assets.humanvsevolution.com/cargo_game/user_monkey.jpeg";
        this.inventory_box =
            "https://assets.humanvsevolution.com/cargo_game/inventory_box.png";
        this.box = "https://assets.humanvsevolution.com/cargo_game/box.png";
    }

    mapConfig(data) {
        for (var item of Object.getOwnPropertyNames(this)) {
            if (typeof data[item] !== "undefined") {
                this[item] = data[item];
            }
        }
    }
}
