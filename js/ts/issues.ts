// * as $ allows ts-node to compile to commonjs and run the tests for this module
import * as $ from "../lib/jquery-3.2.1";
import Github from './github';
import Milestones from './milestones';
import Repositories from './repositories';

export default class Issues {
    static readonly ID_ISSUE_LIST = "issues-list";
    static readonly ID_NEW_ISSUE_TITLE = "new-issue-title";
    static readonly ID_NEW_ISSUE_DETAILS = "new-issue-body";
    static readonly ID_NEW_ISSUE_MILESTONES_BUTTON = "new-issue-milestones-button";
    static readonly ID_NEW_ISSUE_MILESTONES_LIST = "new-issue-milestones-list";

    static retrieve() {
        if (window.location.hash.length > 1) {
            const repositoryUrl = Issues.makeIssuesUrl(window.location.hash);
            // substring removes the hash from the string, as window.location.hash gives bach #Username/reponame
            // this fully replaces the HTML in the element, as it's usually empty or has another repository's name
            document.getElementById(Repositories.ID_DISPLAY_REPOSITORY_NAME).innerHTML = " - " + window.location.hash.substring(1);
            Github.GET(repositoryUrl, Issues.show);
        }
    }

    static show(issues) {
        const elem = document.getElementById(Issues.ID_ISSUE_LIST);
        const all_issues_html = Issues.makeRows(issues);
        elem.innerHTML = Issues.buildInput().outerHTML + all_issues_html;

        // add Enter key triggers for creating an new issue
        const jquery_id_issue_title = "#" + Issues.ID_NEW_ISSUE_TITLE;
        const jquery_id_issue_details = "#" + Issues.ID_NEW_ISSUE_DETAILS;
        $(jquery_id_issue_title).bind("enterKey", Issues.createNewIssue);
        $(jquery_id_issue_title).keyup(function (e) {
            if (e.keyCode == 13) {
                $(this).trigger("enterKey");
            }
        });

        $(jquery_id_issue_details).bind("enterKey", Issues.createNewIssue);
        $(jquery_id_issue_details).keyup(function (e) {
            if (e.keyCode == 13) {
                $(this).trigger("enterKey");
            }
        });

        // milestones must be retrieved after the issues HTML has been built
        // otherwise it will fail to find the button where the milestones have to be placed
        Milestones.retrieve();
    }

    private static makeIssuesUrl(hash) {
        return "https://api.github.com/repos/" + hash.substring(1) + "/issues";
    }

    private static createNewIssue() {
        const data = {
            "title": (<HTMLInputElement>document.getElementById(Issues.ID_NEW_ISSUE_TITLE)).value,
            "body": (<HTMLInputElement>document.getElementById(Issues.ID_NEW_ISSUE_DETAILS)).value,
        };
        // grab the active milestone element
        const milestone = document.getElementById(Milestones.ID_ACTIVE_CHOICE);
        // if no milestone is selected, there will be nothing added to the dictionary.
        // An empty "milestone" fails Github validation, as it expects to have a number present
        if (milestone) {
            data["milestone"] = milestone.dataset.milestoneNumber;
        }
        Github.POST(JSON.stringify(data), Issues.makeIssuesUrl(window.location.hash), function (response) {
            Issues.retrieve();
        });
    }


    private static makeRows(json_data) {
        const rows = [];
        for (const issue of json_data) {
            rows.push(Issues.buildRow(issue));
        }
        return rows.join('');
    }

    /**
     * Build the HTML for the new issue input form.
     */
    private static buildInput(): HTMLElement {
        const outer_div = document.createElement("div");
        outer_div.className = "w3-row w3-dark-grey w3-padding issue-margin-bottom";

        const title_input = document.createElement("input");
        title_input.className = "w3-input w3-border";
        title_input.id = Issues.ID_NEW_ISSUE_TITLE;
        title_input.type = "text";
        title_input.placeholder = "New issue title";
        title_input.autofocus = true;

        const details_input = document.createElement("input");
        details_input.className = "w3-input w3-border";
        details_input.id = Issues.ID_NEW_ISSUE_DETAILS;
        details_input.placeholder = "Details (Optional)";

        outer_div.appendChild(title_input);
        outer_div.appendChild(details_input);

        // options for the issues
        const new_issue_options = document.createElement("div");
        new_issue_options.className = "w3-dropdown-click margin-top-1em";

        const milestone_button = Milestones.buildButton();
        const milestones_list = Milestones.buildList();

        new_issue_options.appendChild(milestone_button);
        new_issue_options.appendChild(milestones_list);

        outer_div.appendChild(new_issue_options);

        return outer_div;
    }

    /**
     * Builds a single row in the issues' list
     * @param issue Dictionary contaning the information for the current issue
     */
    private static buildRow(issue) {
        // div for the whole row
        const row = document.createElement("div");
        row.className = "w3-row w3-dark-grey issue-margin-bottom";

        const link_class_names = "issue-link w3-text-sand w3-padding w3-block w3-ripple w3-hover-green";
        // div for the first element of the row - the issue title and link
        const issue_col = document.createElement("div");
        const issue_link = Issues.buildLinkOpenInNewTab(issue["html_url"], issue["title"] + " #" + issue["number"]);
        issue_link.className = link_class_names;
        issue_link.title = issue["body"];
        issue_col.appendChild(issue_link);

        if (issue["assignees"].length !== 0) {
            issue_col.className = "w3-col s9 m9 l10";
            row.appendChild(issue_col);

            const assignee_col = document.createElement("div");
            assignee_col.className = "w3-col s3 m3 l2";
            const assignee_link = document.createElement("a");
            assignee_link.href = issue["assignees"][0]["html_url"];
            assignee_link.className = link_class_names + " w3-button";
            assignee_link.appendChild(document.createTextNode(issue["assignees"][0]["login"]));
            assignee_col.appendChild(assignee_link);

            if (issue["assignees"].length > 1) {
                assignee_link.text += "...";
                // combine the usernames of the rest of the assignees into a single string
                // the start value is the set to be the first additional assignee, then the rest will be appended
                assignee_link.title = issue["assignees"].slice(2).reduce((previous: string, current) => previous + ", " + current["login"], issue["assignees"][1]["login"]);
            }

            row.appendChild(assignee_col);
        } else {
            row.appendChild(issue_col);
        }
        return row.outerHTML;
    }

    /**
     * Builds the HTML for a link that opens in a new tab.
     * @param address The address that the link will point to
     * @param name Name/label for the tag that will be displayed in HTML
     */
    private static buildLinkOpenInNewTab(address, name) {
        const elem_a = document.createElement('a');
        elem_a.href = encodeURI(address);
        elem_a.target = "_blank";
        // parse the external data safely as text, this protects from XSS
        elem_a.appendChild(document.createTextNode(name));
        return elem_a;
    }
}
