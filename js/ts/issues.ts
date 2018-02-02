import $ from "../lib/jquery-3.2.1";
import Github from './github';
import Milestones from './milestones';

export default class Issues {
    static readonly ID_NEW_ISSUE_TITLE = "new-issue-title";
    static readonly ID_NEW_ISSUE_DETAILS = "new-issue-body";
    static readonly ID_NEW_ISSUE_MILESTONES_BUTTON = "new-issue-milestones-button";
    static readonly ID_NEW_ISSUE_MILESTONES_LIST = "new-issue-milestones-list";

    private static makeIssuesUrl(hash) {
        return "https://api.github.com/repos/" + hash.substring(1) + "/issues";
    }

    static createNewIssue() {
        let data = {
            "title": (<HTMLInputElement>document.getElementById(Issues.ID_NEW_ISSUE_TITLE)).value,
            "body": (<HTMLInputElement>document.getElementById(Issues.ID_NEW_ISSUE_DETAILS)).value,
        };
        // grab the active milestone element
        let milestone = document.getElementById(Milestones.ID_ACTIVE_CHOICE);
        // if no milestone is selected, there will be nothing added to the dictionary.
        // An empty "milestone" fails Github validation, as it expects to have a number present
        if (milestone) {
            data["milestone"] = milestone.dataset.milestoneNumber;
        }
        Github.POST(JSON.stringify(data), Issues.makeIssuesUrl(window.location.hash), function (response) {
            Issues.retrieve();
        });
    }

    static retrieve() {
        if (window.location.hash.length > 1) {
            var repositoryUrl = Issues.makeIssuesUrl(window.location.hash);
            document.getElementById("repo-name").innerHTML = " - " + window.location.hash.substring(1); // removes the hash
            Github.GET(repositoryUrl, Issues.show);
        }
    }

    static show(issues) {
        var elem = document.getElementById("issues-list");
        var all_issues_html = Issues.makeRows(issues);
        elem.innerHTML = Issues.buildInput().outerHTML + all_issues_html;

        // add enter triggers for creating an new issue
        $("#new-issue-title").bind("enterKey", Issues.createNewIssue);
        $("#new-issue-title").keyup(function (e) {
            if (e.keyCode == 13) {
                $(this).trigger("enterKey");
            }
        });
        $("#new-issue-body").bind("enterKey", Issues.createNewIssue);
        $("#new-issue-body").keyup(function (e) {
            if (e.keyCode == 13) {
                $(this).trigger("enterKey");
            }
        });

        // milestones must be retrieved after the issues HTML has been built
        // otherwise it will fail to find the button where the milestones have to be placed
        Milestones.retrieve();
    }

    static makeRows(json_data) {
        var rows = [];
        for (let issue of json_data) {
            rows.push(Issues.buildRow(issue));
        }
        return rows.join('');
    }

    /**
     * Build the HTML for the new issue input form.
     */
    static buildInput(): HTMLElement {
        var outer_div = document.createElement("div");
        outer_div.className = "w3-row w3-dark-grey w3-padding issue-margin-bottom";

        let title_input = document.createElement("input");
        title_input.className = "w3-input w3-border";
        title_input.id = Issues.ID_NEW_ISSUE_TITLE;
        title_input.type = "text";
        title_input.placeholder = "New issue title";
        title_input.autofocus = true;

        let details_input = document.createElement("input");
        details_input.className = "w3-input w3-border";
        details_input.id = Issues.ID_NEW_ISSUE_DETAILS;
        details_input.placeholder = "Details (Optional)";

        outer_div.appendChild(title_input);
        outer_div.appendChild(details_input);

        // options for the issues
        let new_issue_options = document.createElement("div");
        new_issue_options.className = "w3-dropdown-click margin-top-1em";

        let milestone_button = Milestones.buildButton();
        let milestones_list = Milestones.buildList();

        new_issue_options.appendChild(milestone_button);
        new_issue_options.appendChild(milestones_list);

        outer_div.appendChild(new_issue_options);

        return outer_div;
    }

    static buildRow(issue) {
        // div for the whole row
        let row = document.createElement("div");
        row.className = "w3-row w3-dark-grey issue-margin-bottom";

        // div for the first element of the row - the issue title and link
        let issue_col = document.createElement("div");
        let issue_link = Issues.makeLinkOpenInNewTab(issue["html_url"], issue["title"] + " #" + issue["number"]);
        issue_link.className = "issue-link w3-text-sand w3-padding w3-block w3-ripple w3-hover-green";
        issue_col.appendChild(issue_link);

        row.appendChild(issue_col);
        return row.outerHTML;
    }

    static makeLinkOpenInNewTab(address, name) {
        var elem_a = document.createElement('a');
        elem_a.href = encodeURI(address);
        elem_a.target = "_blank";
        // parse the external data safely as text, this protects from XSS
        elem_a.appendChild(document.createTextNode(name));
        return elem_a;
    }
}
