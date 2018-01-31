import CredentialForm from './credential-form';
import Issues from './issues';

export default class Controls {
    static w3_open() {
        document.getElementById("mySidebar").style.display = "block";
        document.getElementById("myOverlay").style.display = "block";
    }

    static w3_close() {
        document.getElementById("mySidebar").style.display = "none";
        document.getElementById("myOverlay").style.display = "none";
    }

    static showRepositoryOptions() {
        var x = document.getElementById("repository-options");
        if (x.className.indexOf("w3-show") == -1) {
            x.className += " w3-show";
        } else {
            x.className = x.className.replace(" w3-show", "");
        }
    }

    static showCredentials() {
        CredentialForm.show();
        Controls.showRepositoryOptions();
    }

    static showMilestones() {
        var x = document.getElementById(Issues.ID_NEW_ISSUE_MILESTONES);
        if (x.className.indexOf("w3-show") == -1) {
            x.className += " w3-show";
        } else {
            x.className = x.className.replace(" w3-show", "");
        }
    }
}
