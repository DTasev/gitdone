import Github from './github';
import Issues from './issues';
import Controls from './site-controls';

export default class Milestones {
    static ID_ACTIVE_MILESTONE = "active-milestone";
    private static makeMilestonesUrl(hash) {
        return "https://api.github.com/repos/" + hash.substring(1) + "/milestones";
    }

    static retrieve(): void {
        if (window.location.hash.length > 1) {
            var repositoryUrl = Milestones.makeMilestonesUrl(window.location.hash);
            Github.GET(repositoryUrl, Milestones.create);
        }
    }
    /**
     * Create the list of milestones available when the user clicks the milestones button
     * @param milestones List of dictionaries, containing milestones information
     */
    static create(milestones: any): void {
        const milestones_list = document.getElementById(Issues.ID_NEW_ISSUE_MILESTONES_LIST);
        for (const [id, milestone] of milestones.entries()) {
            let milestone_html = document.createElement("a");
            milestone_html.className = "w3-bar-item w3-button";
            milestone_html.setAttribute("onclick", "Controls.markActiveMilestone(" + id + ")");
            milestone_html.dataset.milestoneNumber = milestone["number"];
            // convert the title to text, removes potential XSS
            milestone_html.appendChild(document.createTextNode(milestone["title"]));
            milestones_list.appendChild(milestone_html);
        }
    }
    static markActiveMilestone(id: number): void {
        const milestones_list = document.getElementById(Issues.ID_NEW_ISSUE_MILESTONES_LIST);
        const milestones_length = milestones_list.children.length;

        // iterate over each milestone, mark the current selected one as active, otherwise
        // remove the active attributes. This essentially brute force
        // way could be made smarter, but there will rarely be more than a few milestones
        for (let current_idx = 0; current_idx < milestones_length; ++current_idx) {
            const current = milestones_list.children[current_idx];

            // if we are on the selected milestone by the user and it is not already marked as active
            // then mark the current one as active
            if (current_idx == id && current.className.indexOf("w3-red") == -1) {
                current.className += " w3-red";
                current.id = Milestones.ID_ACTIVE_MILESTONE;
            } else {
                // if already marked, or not the selected one, remove the selection 
                current.className = current.className.replace(" w3-red", "");
                // clear the ID
                current.id = "";
            }
        }
        // hide the milestones 'window'
        Controls.toggleMilestones();

        // if the selected one's active status was REMOVED
        if (milestones_list.children[id].className.indexOf("w3-red") == -1) {
            Milestones.toggleButtonActiveVisual(false);
        } else {
            // if the active status was just added, or moved to another milestone
            Milestones.toggleButtonActiveVisual(true);
        }
    }

    static toggleButtonActiveVisual(enabled: boolean): void {
        const milestone_button = document.getElementById(Issues.ID_NEW_ISSUE_MILESTONES_BUTTON);
        const disabled_milestone_class: string = "w3-dark-gray";
        const active_milestone_class: string = "w3-green";
        if (enabled) {
            // only add the class if it is not already marked as enabled
            // the button can be marked if a previous milestone was selected, 
            // and then another milestone was clicked
            if (milestone_button.className.indexOf(active_milestone_class) == -1) {
                milestone_button.className = milestone_button.className.replace(disabled_milestone_class, active_milestone_class);
            }
        } else {
            milestone_button.className = milestone_button.className.replace(active_milestone_class, disabled_milestone_class);
        }
    }
}
