import Github from './github';
import Issues from './issues';

export default class Milestones {
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
        for (let milestone of milestones) {
            let milestone_html = document.createElement("a");
            milestone_html.className = "w3-bar-item w3-button";
            milestone_html.setAttribute("onclick", "")
            // convert the title to text, removes potential XSS
            milestone_html.appendChild(document.createTextNode(milestone["title"]));
            milestones_list.appendChild(milestone_html);
        }
    }
}