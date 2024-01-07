export class EvolutionScene {
    constructor() {}
    __insertSoundObject(src, auto_play = false) {
        var sound = document.createElement("audio");
        sound.src = src;
        sound.setAttribute("preload", "auto");
        sound.setAttribute("controls", "none");
        sound.setAttribute(
            "id",
            Math.random()
                .toString(36)
                .substring(2, 16)
        );
        sound.style.display = "none";
        sound.autoplay = false;
        if (auto_play) {
            sound.setAttribute("loop", "true");
            sound.oncanplaythrough = (event) => {
                var playedPromise = sound.play();
                if (playedPromise) {
                    playedPromise
                        .catch((e) => {
                            console.log(e);
                            if (
                                e.name === "NotAllowedError" ||
                                e.name === "NotSupportedError"
                            ) {
                                console.log(e.name);
                            }
                        })
                        .then(() => {});
                }
            };
        }

        document.body.appendChild(sound);
        return sound;
    }

    injectCSS = (css) => {
        let el = document.createElement("style");
        el.type = "text/css";
        el.innerText = css;
        document.head.appendChild(el);
        return el;
    };
}
