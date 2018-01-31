import CredentialForm from './credential-form';
import Issues from './issues';
import Milestones from './milestones';

export default class Controls {
    static w3_open() {
        document.getElementById("mySidebar").style.display = "block";
        document.getElementById("myOverlay").style.display = "block";
    }

    static w3_close() {
        document.getElementById("mySidebar").style.display = "none";
        document.getElementById("myOverlay").style.display = "none";
    }

    static toggleRepositoryOptions() {
        var x = document.getElementById("repository-options");
        if (x.className.indexOf("w3-show") == -1) {
            x.className += " w3-show";
        } else {
            x.className = x.className.replace(" w3-show", "");
        }
    }

    static showCredentials() {
        CredentialForm.show();
        Controls.toggleRepositoryOptions();
    }

    static toggleMilestones() {
        var x = document.getElementById(Issues.ID_NEW_ISSUE_MILESTONES);
        if (x.className.indexOf("w3-show") == -1) {
            x.className += " w3-show";
        } else {
            x.className = x.className.replace(" w3-show", "");
        }
    }
    static toggleMilestone(id: number) {
        Milestones.toggleMilestone(id);
    }
}
