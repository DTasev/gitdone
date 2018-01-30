export default class LoadIcon {
    static show() {
        document.getElementById("loading-icon").hidden = false;
    }
    static hide() {
        document.getElementById("loading-icon").hidden = true;
    }
}