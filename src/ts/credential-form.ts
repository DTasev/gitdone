export default class CredentialForm {
    static ID_CREDENTIAL_FORM = "user-credential-form";
    static show() {
        document.getElementById(CredentialForm.ID_CREDENTIAL_FORM).hidden = false;
    }


    static hide() {
        document.getElementById(CredentialForm.ID_CREDENTIAL_FORM).hidden = true;
    }
}
