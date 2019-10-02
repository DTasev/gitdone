export class CredentialForm {
    static ID = "user-credential-form";
    static show() {
        document.getElementById(CredentialForm.ID).hidden = false;
    }
    static hide() {
        document.getElementById(CredentialForm.ID).hidden = true;
    }
}
