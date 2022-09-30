import "../css/variables.scss";
import "../css/base.scss";
import "../css/header.scss";
import "../css/npuzzle.scss";
import NPuzzleApp from "./npuzzle/app";
import img from '../img/cmcf.png';

window.onload = function () {
    if (document.querySelectorAll('[data-npuzzle-app]').length) {
        let image = new Image();
        image.src = img;
        image.onload = function () {
            let npuzzleApp = new NPuzzleApp(document.querySelectorAll('[data-npuzzle-app]')[0], image);
            npuzzleApp.init();
        }
    }
};