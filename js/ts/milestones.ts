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
        let milestones_list = document.getElementById(Issues.ID_NEW_ISSUE_MILESTONES);
        // TODO save the milestone["number"] which is necessary for the issue creation as
        // milestone: <int>
        for (const [id, milestone] of milestones.entries()) {
            let milestone_html = document.createElement("a");
            milestone_html.className = "w3-bar-item w3-button";
            milestone_html.setAttribute("onclick", "Controls.toggleMilestone(" + id + ")");
            // convert the title to text, removes potential XSS
            milestone_html.appendChild(document.createTextNode(milestone["title"]));
            milestones_list.appendChild(milestone_html);
        }
    }
    static toggleMilestone(id: number): void {
        let milestones_list = document.getElementById(Issues.ID_NEW_ISSUE_MILESTONES);
        let milestones_length = milestones_list.children.length;
        // iterate over each milestone, remove active if it's not the current one
        // and mark the current selected one as active
        for (let current_idx = 0; current_idx < milestones_length; ++current_idx) {
            let current = milestones_list.children[current_idx];

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
            Controls.toggleMilestones();
        }
    }

}