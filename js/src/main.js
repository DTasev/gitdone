// TODO move to github.js
function makeRepositoryIssuesUrl(hash) {
    return "https://api.github.com/repos/" + hash.substring(1) + "/issues";
}

function makeLink(address, name) {
    var elem_a = document.createElement('a');
    elem_a.href = encodeURI(address);
    elem_a.appendChild(document.createTextNode(name));
    return elem_a;
}

function makeLinkOpenInNewTab(address, name) {
    var elem_a = document.createElement('a');
    elem_a.href = encodeURI(address);
    elem_a.target = "_blank";
    // parse the external data safely as text, this protects from XSS
    elem_a.appendChild(document.createTextNode(name));
    return elem_a;
}

function makeImageLinkOpenInNewTab(address) {
    var elem_a = document.createElement('a');
    elem_a.href = encodeURI(address);
    elem_a.target = "_blank";
    var img = document.createElement("img");
    img.src = ImageUrl.EXTERNAL;
    elem_a.appendChild(img);
    return elem_a.outerHTML;
}

function makeRepositoryRows(json_data) {
    var rows = [];
    for (let entry of json_data.entries()) {
        rows.push(buildRepositoryRow(entry));
    }
    return Pinned.reorder(rows).join('');
}

function makeRows(json_data) {
    var rows = [];
    for (let entry of json_data.entries()) {
        rows.push(buildEntryRow(entry));
    }
    return rows;
}

function makeIssueInputField() {
    var outer_div = document.createElement("div");
    outer_div.className = "w3-row w3-dark-grey w3-padding";
    outer_div.innerHTML = '<input class="w3-input w3-border" id="new-issue-title" type="text" placeholder="New issue Title" autofocus /><input class="w3-input w3-border" id="new-issue-body" type="text" placeholder="Details (Optional)" />';
    return outer_div.outerHTML;
}

function showRepositories(repositories) {
    var elem = document.getElementById("repository-list");
    elem.innerHTML = makeRepositoryRows(repositories);
}

function buildRepositoryRow(id_entry_tuple) {
    let id = id_entry_tuple[0];
    let entry = id_entry_tuple[1];

    var link = makeLink("#" + entry["full_name"], entry["name"]);
    link.className = "repo-link w3-button w3-padding w3-text-teal w3-col m8 l8";
    link.setAttribute('onclick', "w3_close();");

    var ext_link = document.createElement("a");
    var ext_img = document.createElement("img");
    ext_link.href = entry["html_url"];
    ext_link.target = "_blank";
    ext_img.src = ImageUrl.EXTERNAL;
    ext_link.appendChild(ext_img);
    ext_link.className = "w3-button w3-padding w3-text-teal w3-hover-opacity w3-col m2 l2";

    var pin_span = document.createElement("span");
    var pin_img = document.createElement("img");
    pin_img.src = ImageUrl.PIN;
    pin_span.appendChild(pin_img);
    pin_span.setAttribute('onclick', 'Pinned.addOrRemove(' + id + ');');

    pin_span.className = "w3-button w3-padding w3-text-teal w3-hover-opacity w3-col m2 l2";
    $(pin_span).on('click', $.proxy(Pinned.addOrRemove, this));
    var div = document.createElement("div");
    div.className = "w3-row";
    div.id = 'repo_' + id;
    div.appendChild(link);
    div.appendChild(pin_span);
    div.appendChild(ext_link);

    return div.outerHTML;
}

function buildEntryRow(id_issue_tuple) {
    let issue = id_issue_tuple[1];
    var outer_div = document.createElement("div");
    outer_div.className = "w3-row w3-dark-grey issue-margin-bottom";
    var new_tab_link_a = makeLinkOpenInNewTab(issue["html_url"], issue["title"] + " #" + issue["number"]);
    new_tab_link_a.className = "issue-link w3-text-sand w3-padding w3-block w3-ripple w3-hover-green";
    outer_div.appendChild(new_tab_link_a);
    return outer_div.outerHTML;
}

function showIssuesForRepo(issues) {
    var elem = document.getElementById("issues-list")
    var newhtml = makeRows(issues);
    elem.innerHTML = newhtml + makeIssueInputField();
    $("#new-issue-title").bind("enterKey", createNewIssue);
    $("#new-issue-title").keyup(function (e) {
        if (e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });
    $("#new-issue-body").bind("enterKey", createNewIssue);
    $("#new-issue-body").keyup(function (e) {
        if (e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });
}

// Function specific to hiding the rows of a table
function filterRepos(e) {
    let string = $("#repo-filter input").val().toLowerCase();
    let repo;

    let repo_row_tag = "#repository-list .w3-row";
    if (string.length > 0) {
        // which tag is captured will have to be changed, if the table is removed
        $(repo_row_tag).each(function (i, v) {
            if (v.children[0].text.indexOf(string) == -1) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    } else {
        $(repo_row_tag).show();
    }
}

function showIssues() {
    var repositoryUrl = makeRepositoryIssuesUrl(window.location.hash);
    Github.GET(repositoryUrl, showIssuesForRepo);
}

$(document).on('keyup', "#repo-filter input", $.proxy(filterRepos, this));
$("#api-key").on('change', function () {
    Github.GET(Github.REPOSITORIES_URL, showRepositories);
});
$(document).ready(function () {
    // simulate a click, this allows Chrome to set the credentials' field value
    // if we don't do this then api-key is empty on the first github GET
    document.getElementById("api-key").click();
    Github.GET(Github.REPOSITORIES_URL, showRepositories);
});

$(window).on('hashchange', function () {
    if (window.location.hash.length > 1) {
        showIssues();
    }
});

function createNewIssue() {
    var data = {
        "title": $("#new-issue-title").val(),
        "body": $("#new-issue-body").val()
    };

    Github.POST(JSON.stringify(data), makeRepositoryIssuesUrl(window.location.hash), function (response) {
        showIssues();
    });
}