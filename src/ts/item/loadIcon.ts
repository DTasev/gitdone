export class LoadIcon {
    static ID = "loading-icon";

    static show() {
        document.getElementById(LoadIcon.ID).hidden = false;
    }

    static hide() {
        document.getElementById(LoadIcon.ID).hidden = true;
    }
}