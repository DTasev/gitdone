// * as $ allows ts-node to compile to commonjs and run the tests for this module
import * as $ from "../lib/jquery-3.2.1";
import Github from './github';
import Pinned from './pin-manager';
import CredentialForm from './credential-form';
import Issues from './issues';
import Milestones from './milestones';

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
        const link = Repositories.buildLink("#" + repository["full_name"], repository["name"]);
        link.className = "repo-link w3-button w3-padding w3-text-teal w3-col s8 m8 l8";
        link.setAttribute('onclick', "Controls.w3_close()");

        const ext_link = document.createElement("a");
        const ext_font_awesome = document.createElement("i");
        ext_font_awesome.className = 'fas fa-external-link-alt';
        ext_font_awesome.setAttribute("aria-hidden", "true");
        ext_link.href = repository["html_url"];
        ext_link.target = "_blank";
        ext_link.appendChild(ext_font_awesome);
        ext_link.className = "w3-button w3-padding w3-hover-opacity w3-col s2 m2 l2";

        const pin_span = document.createElement("span");
        const pin_img = document.createElement("i");
        pin_img.className = 'fas fa-thumbtack';
        pin_img.setAttribute("aria-hidden", "true");
        pin_span.appendChild(pin_img);
        pin_span.setAttribute('onclick', 'Pinned.toggle(' + id + ');');
        pin_span.className = "w3-button w3-padding w3-hover-opacity w3-col s2 m2 l2";

        const div = document.createElement("div");
        div.className = "w3-row";
        div.id = Repositories.ID_REPO_PREFIX + id;
        div.appendChild(link);
        div.appendChild(pin_span);
        div.appendChild(ext_link);

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