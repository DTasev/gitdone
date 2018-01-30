import CredentialForm from './credential-formts';

// TODO move to Typescript object with static functions, and import in main.js then do window.<class> = <class>
// Script to open and close sidebar
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}

function showRepositoryOptions() {
    var x = document.getElementById("repository-options");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

function showCredentials() {
    CredentialForm.show();
    showRepositoryOptions();
}

window.w3_open = w3_open;
window.w3_close = w3_close;
window.showRepositoryOptions = showRepositoryOptions;
window.showCredentials = showCredentials;