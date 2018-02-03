export default class LoadIcon {
    static ID_LOAD_ICON = "loading-icon";

    static show() {
        document.getElementById(LoadIcon.ID_LOAD_ICON).hidden = false;
    }

    static hide() {
        document.getElementById(LoadIcon.ID_LOAD_ICON).hidden = true;
    }
}