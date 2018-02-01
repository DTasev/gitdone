import $ from "../lib/jquery-3.2.1";
import Github from './github';
import Pinned from './pin-manager';
import CredentialForm from './credential-form';
import Issues from './issues';
export default class Repositories {
    static retrieve(use_cached = false) {
        if (use_cached && Repositories.repo_cache) {
            // Don't query github for the repositories, and use the cache
            Repositories.show(Repositories.repo_cache);
        }
        else {
            Github.GET(Github.REPOSITORIES_URL, Repositories.show);
        }
    }
    static show(repositories) {
        let repo_list = document.getElementById("repository-list");
        Repositories.repo_cache = repositories;
        repo_list.innerHTML = Repositories.makeRows(repositories);
        // it will retrieve any issues, if the URL already contains a hash
        // this can happen if the user reloads the page with a hash already in the URL
        Issues.retrieve();
        // hide the credential form, only after a successful authentication
        CredentialForm.hide();
    }
    static makeRows(json_data) {
        let rows = [];
        for (let entry of json_data.entries()) {
            rows.push(Repositories.buildRow(entry));
        }
        rows = Pinned.reorder(rows);
        return rows.reduce((prev, current) => prev += current.outerHTML, "");
    }
    static makeLink(address, name) {
        let elem_a = document.createElement('a');
        elem_a.href = encodeURI(address);
        elem_a.appendChild(document.createTextNode(name));
        return elem_a;
    }
    static buildRow(id_entry_tuple) {
        let id = id_entry_tuple[0];
        let entry = id_entry_tuple[1];
        var link = Repositories.makeLink("#" + entry["full_name"], entry["name"]);
        link.className = "repo-link w3-button w3-padding w3-text-teal w3-col s8 m8 l8";
        link.setAttribute('onclick', "Controls.w3_close()");
        var ext_link = document.createElement("a");
        var ext_font_awesome = document.createElement("i");
        ext_font_awesome.className = 'fas fa-external-link-alt';
        ext_font_awesome.setAttribute("aria-hidden", "true");
        ext_link.href = entry["html_url"];
        ext_link.target = "_blank";
        ext_link.appendChild(ext_font_awesome);
        ext_link.className = "w3-button w3-padding w3-hover-opacity w3-col s2 m2 l2";
        var pin_span = document.createElement("span");
        var pin_img = document.createElement("i");
        pin_img.className = 'fas fa-thumbtack';
        pin_img.setAttribute("aria-hidden", "true");
        pin_span.appendChild(pin_img);
        pin_span.setAttribute('onclick', 'Pinned.addOrRemove(' + id + ');');
        pin_span.className = "w3-button w3-padding w3-hover-opacity w3-col s2 m2 l2";
        var div = document.createElement("div");
        div.className = "w3-row";
        div.id = 'repo_' + id;
        div.appendChild(link);
        div.appendChild(pin_span);
        div.appendChild(ext_link);
        return div;
    }
    static filterRepositories(e) {
        let string = $("#repo-filter input").val().toLowerCase();
        let repo;
        let repo_row_tag = "#repository-list .w3-row";
        if (string.length > 0) {
            $(repo_row_tag).each(function (i, v) {
                if (v.children[0].text.indexOf(string) == -1) {
                    $(this).hide();
                }
                else {
                    $(this).show();
                }
            });
        }
        else {
            $(repo_row_tag).show();
        }
    }
}
Repositories.repo_cache = null;
//# sourceMappingURL=repositories.js.map