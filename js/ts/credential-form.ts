export default class CredentialForm {
    static show() {
        document.getElementById("user-credential-form").hidden = false;
    }


    static hide() {
        document.getElementById("user-credential-form").hidden = true;
    }
}
