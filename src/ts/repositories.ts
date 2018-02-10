// * as $ allows ts-node to compile to commonjs and run the tests for this module
import * as $ from "../lib/jquery-3.2.1";
import Github from './github';
import Pinned from './pin-manager';
import CredentialForm from './credential-form';
import Issues from './issues';
import Milestones from './milestones';
import { P } from "./parser";
import Controls from "./site-controls";
import { Filter } from "./filter-options";

export default class Repositories {
    static ID_REPO_PREFIX = "repo_";
    static ID_REPO_FILTER = "repo-filter";
    static ID_REPOSITORY_LIST = "repository-list";
    static ID_DISPLAY_REPOSITORY_NAME = "display-repo-name";
    static repo_cache = null;

    static retrieve(use_cached: boolean = false) {
        if (use_cached && Repositories.repo_cache) {
            // Don't query github for the repositories, and use the cache
            Repositories.show(Repositories.repo_cache);
        }
        else {
            Github.GET(Github.REPOSITORIES_URL, Repositories.show);
        }
    }

    static show(repositories) {
        const repo_list = document.getElementById(Repositories.ID_REPOSITORY_LIST);
        Repositories.repo_cache = repositories;
        repo_list.innerHTML = Repositories.makeRows(repositories);

        // it will retrieve any issues, if the URL already contains a hash
        // this can happen if the user reloads the page with a hash already in the URL
        Issues.retrieve();
        // hide the credential form, only after a successful authentication
        CredentialForm.hide();
        // create the buttons for the filter options
        Filter.create();
    }

    private static makeRows(json_data) {
        let rows: Array<HTMLDivElement> = [];
        for (const [id, repository] of json_data.entries()) {
            rows.push(Repositories.buildRow(id, repository));
        }
        rows = Pinned.reorder(rows);
        return rows.reduce((prev, current) => prev += current.outerHTML, "");
    }

    private static buildLink(address, name) {
        const elem_a = document.createElement('a');
        elem_a.href = encodeURI(address);
        elem_a.appendChild(document.createTextNode(name));
        return elem_a;
    }

    private static buildRow(id, repository) {
        const button_classes: string = "w3-button w3-padding w3-hover-opacity w3-col s2 m2 l2";
        const div: HTMLDivElement = <HTMLDivElement>P.json2html({
            // element for the row
            "div": {
                "className": "w3-row",
                "id": Repositories.ID_REPO_PREFIX + id,
                "children": [{
                    // the link that can be clicked to load the repository's issues
                    "a": {
                        "href": encodeURI("#" + repository["full_name"]),
                        "text": repository["name"],
                        "className": "repo-link w3-button w3-padding w3-text-teal w3-col s8 m8 l8",
                        "onclick": "Controls.w3_close()"
                    }
                }, {
                    // pin button
                    "button": {
                        "onclick": "Pinned.toggle(" + id + ")",
                        "className": button_classes,
                        "children": [{
                            "i": {
                                "className": 'fas fa-thumbtack',
                                "aria-hidden": true
                            }
                        }]
                    }
                }, {
                    // the link that opens the page in github    
                    "a": {
                        "href": repository["html_url"],
                        "target": "_blank",
                        "className": button_classes,
                        "children": [{
                            "i": {
                                "className": "fas fa-external-link-alt",
                                "aria-hidden": true
                            }
                        }]
                    }
                }]
            }
        });
        return div;
    }

    static filterRepositories(e) {
        const filter_string = $("#" + Repositories.ID_REPO_FILTER + " input").val().toLowerCase();
        const repo_row_tag = "#" + Repositories.ID_REPOSITORY_LIST + " .w3-row";

        if (filter_string.length > 0) {
            $(repo_row_tag).each(function (i, v) {
                if (v.children[0].text.indexOf(filter_string) == -1) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });
        } else {
            $(repo_row_tag).show();
        }
    }
}