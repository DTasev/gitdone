import CredentialForm from './credential-form';

// Script to open and close sidebar
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}

export function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}

export function showRepositoryOptions() {
    var x = document.getElementById("repository-options");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

export function showCredentials() {
    CredentialForm.show();
    showRepositoryOptions();
}

window.w3_open = w3_open;
window.w3_close = w3_close;
window.showRepositoryOptions = showRepositoryOptions;
window.showCredentials = showCredentials;