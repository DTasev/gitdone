import $ from "../lib/jquery-3.2.1";
import Github from './githubts';

export default class Issues {
    private static makeRepositoryIssuesUrl(hash) {
        return "https://api.github.com/repos/" + hash.substring(1) + "/issues";
    }

    static createNewIssue() {
        var data = {
            "title": $("#new-issue-title").val(),
            "body": $("#new-issue-body").val()
        };

        Github.POST(JSON.stringify(data), Issues.makeRepositoryIssuesUrl(window.location.hash), function (response) {
            Issues.retrieve();
        });
    }

    static retrieve = function () {
        if (window.location.hash.length > 1) {
            var repositoryUrl = Issues.makeRepositoryIssuesUrl(window.location.hash);
            document.getElementById("repo-name").innerHTML = " - " + window.location.hash.substring(1); // removes the hash
            Github.GET(repositoryUrl, Issues.show);
        }
    }

    static show = function (issues) {
        var elem = document.getElementById("issues-list");
        var newhtml = Issues.makeRows(issues);
        elem.innerHTML = Issues.makeInput() + newhtml;

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
    }

    static makeRows = function (json_data) {
        var rows = [];
        for (let entry of json_data.entries()) {
            rows.push(Issues.buildRow(entry));
        }
        return rows.join('');
    }

    static makeInput = function () {
        var outer_div = document.createElement("div");
        outer_div.className = "w3-row w3-dark-grey w3-padding issue-margin-bottom";
        outer_div.innerHTML = '<input class="w3-input w3-border" id="new-issue-title" type="text" placeholder="New issue Title" autofocus /><input class="w3-input w3-border" id="new-issue-body" type="text" placeholder="Details (Optional)" />';
        return outer_div.outerHTML;
    }

    static buildRow = function (id_issue_tuple) {
        let issue = id_issue_tuple[1];
        var outer_div = document.createElement("div");
        outer_div.className = "w3-row w3-dark-grey issue-margin-bottom";
        var new_tab_link_a = Issues.makeLinkOpenInNewTab(issue["html_url"], issue["title"] + " #" + issue["number"]);
        new_tab_link_a.className = "issue-link w3-text-sand w3-padding w3-block w3-ripple w3-hover-green";
        outer_div.appendChild(new_tab_link_a);
        return outer_div.outerHTML;
    }

    static makeLinkOpenInNewTab = function (address, name) {
        var elem_a = document.createElement('a');
        elem_a.href = encodeURI(address);
        elem_a.target = "_blank";
        // parse the external data safely as text, this protects from XSS
        elem_a.appendChild(document.createTextNode(name));
        return elem_a;
    }
}