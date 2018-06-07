// * as $ allows ts-node to compile to commonjs and run the tests for this module
import * as $ from "jquery";
import Github from '../github';
import Milestones from './milestones';
import Repositories from './repositories';
import { J2H } from "../json2html";
import Filter from "./filter";
import { IS_MOBILE } from '../util';

export default class Issues {
    static readonly ID_NEW_ISSUE_SEND_BUTTON = "issue-submit-button";
    static readonly ID_ISSUE_LIST = "issues-list";
    static readonly ID_NEW_ISSUE_TITLE = "new-issue-title";
    static readonly ID_NEW_ISSUE_DETAILS = "new-issue-body";
    static readonly ID_NEW_ISSUE_MILESTONES_BUTTON = "new-issue-milestones-button";
    static readonly ID_NEW_ISSUE_MILESTONES_LIST = "new-issue-milestones-list";

    // by default do not download the issues on mobile, just build the input and show the option to DL everything
    static downloadOnMobile = !IS_MOBILE;

    static retrieve(allowCache = false) {
        if (this.downloadOnMobile && window.location.hash.length > 1) {
            const repository_url = `${this.makeIssuesUrl(window.location.hash)}` + (allowCache ? "" : `?${Filter.option()}+_=${new Date().getTime()}`);
            // substring removes the hash from the string, as window.location.hash gives bach #Username/reponame
            // this fully replaces the HTML in the element, as it's usually empty or has another repository's name
            Github.GET(repository_url, this.show);
        } else {
            this.showOnlyInput();
        }
        document.getElementById(Repositories.ID_DISPLAY_REPOSITORY_NAME).innerHTML = " - " + window.location.hash.substring(1);
    }
    static showOnlyInput() {
        const elem = document.getElementById(Issues.ID_ISSUE_LIST);
        elem.innerHTML = Issues.buildInput().outerHTML;
        // TODO add button load all that will override the IS_MOBILE check;
        Issues.addIssueInputEvents();
        const d_checkbox = {
            div: {
                className: "w3-row w3-dark-grey issue-margin-bottom",
                children: [{
                    button: {
                        className: "w3-padding w3-button w3-white w3-border",
                        style: "width:100%",
                        type: "button",
                        textContent: "Download all issues (will use data!)",
                        onclick: function () { Issues.downloadOnMobile = !Issues.downloadOnMobile; Issues.retrieve() }
                    }
                }]
            }
        }
        elem.appendChild(J2H.parse(d_checkbox));
    }

    static show(issues) {
        const elem = document.getElementById(Issues.ID_ISSUE_LIST);
        const all_issues_html = Issues.makeRows(issues);
        elem.innerHTML = Issues.buildInput().outerHTML + all_issues_html;

        // add Enter key triggers for creating an new issue
        Issues.addIssueInputEvents();
        // milestones must be retrieved after the issues HTML has been built
        // otherwise it will fail to find the button where the milestones have to be placed
        Milestones.retrieve();
    }

    private static addIssueInputEvents() {
        const createNewIssueOnEnter = (e) => {
            if (e.keyCode == 13 && !(e.shiftKey || e.ctrlKey)) {
                Issues.createNewIssue();
            }
        };
        document.getElementById(Issues.ID_NEW_ISSUE_TITLE).onkeydown = createNewIssueOnEnter;
        document.getElementById(Issues.ID_NEW_ISSUE_DETAILS).onkeydown = createNewIssueOnEnter;
        document.getElementById(Issues.ID_NEW_ISSUE_SEND_BUTTON).onclick = () => { Issues.createNewIssue(); };
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
        const outer_div_desc = {
            "div": {
                "className": "w3-row w3-dark-grey w3-padding issue-margin-bottom",
                "children": [{
                    "input": {
                        "className": "w3-input w3-border",
                        "id": Issues.ID_NEW_ISSUE_TITLE,
                        "type": "text",
                        "placeholder": "New issue title",
                        "autofocus": true
                    }
                }, {
                    "textarea": {
                        "className": "w3-input w3-border",
                        "id": Issues.ID_NEW_ISSUE_DETAILS,
                        "placeholder": "Details (Optional)"
                    }
                }, {
                    button: {
                        className: "w3-button w3-border w3-white w3-right w3-margin-top",
                        textContent: "Send",
                        id: Issues.ID_NEW_ISSUE_SEND_BUTTON
                    }
                }]
            }
        };

        const outer_div = J2H.parse<HTMLElement>(outer_div_desc);

        const new_issue_options = J2H.parse({
            "div": {
                "className": "w3-dropdown-click margin-top-1em"
            }
        });

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
        const row = J2H.parse({
            "div": {
                "className": "w3-row w3-dark-grey issue-margin-bottom"
            }
        });

        const link_class_names = "issue-link w3-text-sand w3-padding w3-block w3-ripple w3-hover-green";

        const issue_col = J2H.parse({
            "div": {
                "children": [{
                    "a": {
                        "href": encodeURI(issue["html_url"]),
                        "target": "_blank",
                        "text": issue["title"] + " #" + issue["number"],
                        "className": link_class_names,
                        "title": issue["body"]
                    }
                }]
            }
        })

        // if there is someone assigned to the issue, then add their name
        if (issue["assignees"].length !== 0) {
            issue_col.className = "w3-col s9 m9 l10";
            // add the issue name column first, the following ones will appear on its left
            row.appendChild(issue_col);
            let assignee_link_text = issue["assignees"][0]["login"];
            let assignee_link_title = "";
            if (issue["assignees"].length > 1) {
                assignee_link_text += "...";
                // combine the usernames of the rest of the assignees into a single string
                // the start value is the set to be the first additional assignee, then the rest will be appended
                assignee_link_title = issue["assignees"].slice(2).reduce((previous: string, current) => previous + ", " + current["login"], issue["assignees"][1]["login"]);
            }

            const assignee_col = {
                "div": {
                    "className": "w3-col s3 m3 l2 w3-center",
                    "children": [{
                        "a": {
                            "href": issue["assignees"][0]["html_url"],
                            "className": link_class_names + " w3_button",
                            "text": assignee_link_text,
                            "title": assignee_link_title
                        }
                    }]
                }
            };

            row.appendChild(J2H.parse(assignee_col));
        } else {
            row.appendChild(issue_col);
        }
        return row.outerHTML;
    }
}
