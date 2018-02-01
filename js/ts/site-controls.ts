import CredentialForm from './credential-form';
import Issues from './issues';
import Milestones from './milestones';

export default class Controls {

    private static toggle_w3_show(html_elem) {
        if (html_elem.className.indexOf("w3-show") == -1) {
            html_elem.className += " w3-show";
        } else {
            html_elem.className = html_elem.className.replace(" w3-show", "");
        }
    }
    static w3_open() {
        document.getElementById("mySidebar").style.display = "block";
        document.getElementById("myOverlay").style.display = "block";
    }

    static w3_close() {
        document.getElementById("mySidebar").style.display = "none";
        document.getElementById("myOverlay").style.display = "none";
    }

    static toggleRepositoryOptions() {
        Controls.toggle_w3_show(document.getElementById("repository-options"));
    }

    static showCredentials() {
        CredentialForm.show();
        Controls.toggleRepositoryOptions();
    }

    static toggleMilestones() {
        Controls.toggle_w3_show(document.getElementById(Issues.ID_NEW_ISSUE_MILESTONES_LIST));
    }

    static markActiveMilestone(id: number) {
        Milestones.markActiveMilestone(id);
    }
}
