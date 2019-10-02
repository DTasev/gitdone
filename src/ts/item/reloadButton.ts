export class ReloadButton {
    static ID = "reload-button";

    static show() {
        document.getElementById(ReloadButton.ID).hidden = false;
    }

    static hide() {
        document.getElementById(ReloadButton.ID).hidden = true;
    }
}