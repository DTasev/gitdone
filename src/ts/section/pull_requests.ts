// * as $ allows ts-node to compile to commonjs and run the tests for this module
import * as $ from "jquery";
import Github from '../github';
import Milestones from './milestones';
import Repositories from './repositories';
import { J2H } from "../json2html";
import Filter from "./filter";
import { IS_MOBILE } from '../util';

export default class PullRequests {
    // static readonly ID_NEW_ISSUE_SEND_BUTTON = "issue-submit-button";
    static readonly ID_PR_LIST = "data-list";
    // static readonly ID_NEW_ISSUE_TITLE = "new-issue-title";
    // static readonly ID_NEW_ISSUE_DETAILS = "new-issue-body";
    // static readonly ID_NEW_ISSUE_MILESTONES_BUTTON = "new-issue-milestones-button";
    // static readonly ID_NEW_ISSUE_MILESTONES_LIST = "new-issue-milestones-list";

    // by default do not download the issues on mobile, just build the input and show the option to DL everything
    static downloadOnMobile = !IS_MOBILE;

    static retrieve(allowCache = false) {
        if (window.location.hash.length > 1) {
            // if not allowing cache -> an arbitrary string is attached so the browser cannot recognise the request
            const repository_url = `${this.makeUrl(window.location.hash)}` + (allowCache ? "" : `?${Filter.option()}+_=${new Date().getTime()}`);
            Github.GET(repository_url, this.show);
        }
        document.getElementById(Repositories.ID_DISPLAY_PAGE_NAME).innerHTML = "Pull Requests";
        document.getElementById(Repositories.ID_DISPLAY_REPOSITORY_NAME).innerHTML = " - " + window.location.hash.substring(1);
    }
    static show(prs) {
        const elem = document.getElementById(PullRequests.ID_PR_LIST);
        elem.innerHTML = PullRequests.makeRows(prs);

        // milestones must be retrieved after the issues HTML has been built
        // otherwise it will fail to find the button where the milestones have to be placed
        // Milestones.retrieve();
    }


    private static makeUrl(hash: string) {
        return "https://api.github.com/repos/" + hash.substring(1) + "/pulls";
    }
    private static makeDetailsUrl(hash: string, num: number) {
        return "https://api.github.com/repos/" + hash.substring(1) + "/pulls/" + num;
    }
    private static makeDetailsUrlReviews(hash: string, num: number) {
        return "https://api.github.com/repos/" + hash.substring(1) + "/pulls/" + num + "/reviews";
    }

    private static makeRows(json_data) {
        const rows = [];
        for (const issue of json_data) {
            rows.push(this.buildRow(issue));
        }
        return rows.join('');
    }

    /**
     * Builds a single row in the issues' list
     * @param issue Dictionary contaning the information for the current issue
     */
    private static buildRow(issue) {
        // div for the whole row

        const row_list = [{
            "div": {
            }
        }, {
            "div": {

            }
        }]

        const row = J2H.parse({
            "div": {
                "className": "w3-row w3-dark-grey issue-margin-bottom",
                "children": row_list
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
                        "title": issue["body"],
                    }
                }]
            }
        })

        // if there is someone assigned to the issue, then add their name
        if (issue["assignees"].length > 0) {
            issue_col.className = "w3-col s9 m9 l10";
            // add the issue name column first, the following ones will appear on its left
            row.appendChild(issue_col);

            let children = [];
            for (const assignee of issue["assignees"]) {
                children.push({
                    "a": {
                        "href": assignee["html_url"],
                        "className": "w3-button",
                        "title": assignee["login"],
                        "children": [{
                            img: {
                                src: assignee["avatar_url"],
                                width: "32",
                                height: "32"
                            }
                        }]
                    }
                });
            }

            const assignee_col = {
                "div": {
                    "className": "w3-col s3 m3 l2 w3-center",
                    "children": children
                }
            };

            row.appendChild(J2H.parse(assignee_col));
        } else {
            row.appendChild(issue_col);
        }
        return row.outerHTML;
    }
}
