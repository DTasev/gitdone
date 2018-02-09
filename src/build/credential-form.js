export default class CredentialForm {
    static show() {
        document.getElementById(CredentialForm.ID_CREDENTIAL_FORM).hidden = false;
    }
    static hide() {
        document.getElementById(CredentialForm.ID_CREDENTIAL_FORM).hidden = true;
    }
}
CredentialForm.ID_CREDENTIAL_FORM = "user-credential-form";
//# sourceMappingURL=credential-form.js.map