

export class Config {

    constructor() {
       
        this.canvas_id = "blue_tomb";
        this.width = "100%";
        this.height = "100%";
        this.theme_music = "/sound/delete_theme.mp3";
        this.hover_sound = "/sound/bluetomb_hover.wav";
        this.mouse_click="/sound/bluetomb_mouseclick.wav";
        this.mouse_leave="/sound/bluetomb_mouseleave.wav";
        this.modal_open_sound="/sound/bluetomb_modalopen.wav";
        this.drop_sound="bluetomb_drop.wav";
        this.rain_sound="/sound/bluetomb_rain.mp3"
        this.background_image = "";
        this.user_name = "Demo";
        this.user_email = "demo@demo.com";
        this.user_avatar = "/img/sdsdd.png";
        this.register_date = 0;
        this.death_date = 0;
        this.init = false;
        this.use_music = true;
        this.use_snow = true;        
        this.fps = 24;
        this.submit_text="SUBMIT";
        this.recover_text="RECOVER";
        this.logout_text="LOGOUT";
        this.close_text="CLOSE";
        this.modal_text= "Can you enter your password again to activate the account?";
        this.warn_text="Your account will be permanently deleted shortly!";
        this.crow_sound="bluetomb_ambicent_crow.wav";
        this.error_sound="bluetomb_error_sound.wav";
        this.key_sound="bluetomb_key.wav";
        this.activate_ep="/activate";
        this.logout_ep="logout";
        this.notification_token="";
        this.csrf_token="";




    }

    mapConfig(data) {

        for (var item of Object.getOwnPropertyNames(this)) {

            if (typeof data[item] !== "undefined") {
                this[item] = data[item];
            }
        }


    }

}

