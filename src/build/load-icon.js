export default class LoadIcon {
    static show() {
        document.getElementById(LoadIcon.ID_LOAD_ICON).hidden = false;
    }
    static hide() {
        document.getElementById(LoadIcon.ID_LOAD_ICON).hidden = true;
    }
}
LoadIcon.ID_LOAD_ICON = "loading-icon";
//# sourceMappingURL=load-icon.js.map