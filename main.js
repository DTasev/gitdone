var GITHUB_REPOSITORIES_URL = "https://api.github.com/user/repos";
var GITHUB_REPO_BASE_URL = "https://api.github.com/repos/";
var EXTERNAL_IMAGE_URL = encodeURI("https://i.imgur.com/1DpOZzv.png");
function makeRepositoryIssuesUrl(hash) {
    return "https://api.github.com/repos/" + hash.substring(1) + "/issues";
}

function github_GET(url, callback) {
    var request = new XMLHttpRequest();
    var auth_basic = window.btoa($("#username input").val() + ":" + $("#api-key input").val());
    request.open("GET", url, true);
    request.setRequestHeader("Authorization", "Basic " + auth_basic);
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            callback(JSON.parse(request.responseText));
            $("#error-message").html("");
        } else {
            var error_message = "";
            if (request.responseText) {
                error_message = JSON.parse(request.responseText)["message"]
            }
            $("#error-message").html("<p>" + request.status + " " + error_message + "</p>");
        }
    };
    request.send(null);
}
function github_POST(data, url, callback) {
    var request = new XMLHttpRequest();
    var auth_basic = window.btoa($("#username input").val() + ":" + $("#api-key input").val());
    request.open("POST", url, true);
    request.setRequestHeader("Authorization", "Basic " + auth_basic);
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 201) {
            callback(JSON.parse(request.responseText));
            $("#error-message").html("");
        } else {
            $("#error-message").html("<p>" + request + "</p>");
        }
    };
    request.send(data);
}

function makeLink(address, name) {
    var elem_a = document.createElement('a');
    elem_a.href = encodeURI(address);
    elem_a.appendChild(document.createTextNode(name));
    return elem_a.outerHTML;
}

function makeLinkOpenInNewTab(address, name) {
    var elem_a = document.createElement('a');
    elem_a.href = encodeURI(address);
    elem_a.target = "_blank";
    elem_a.appendChild(document.createTextNode(name));
    return elem_a.outerHTML;
}

function makeImageLinkOpenInNewTab(address) {
    var elem_a = document.createElement('a');
    elem_a.href = encodeURI(address);
    elem_a.target = "_blank";
    var img = document.createElement("img");
    img.src = EXTERNAL_IMAGE_URL;
    elem_a.appendChild(img);
    return elem_a.outerHTML;
    // return '<a href="' + encodeURI(address) + '" target="_blank"></a>';
}
function getDataForRepository(repo_entry) {
    return "<td>" + makeLink("#" + repo_entry["full_name"], repo_entry["name"]) + '</td><td><span>' + makeImageLinkOpenInNewTab(repo_entry["html_url"]) + '</span></td>';
}

function makeTableRows(json_data, data_parsing_func) {
    var newhtml = "";
    for (var entry of json_data) {
        newhtml += "<tr>" + data_parsing_func(entry) + "</tr>";
    }
    return newhtml;
}

function makeIssueInputField() {
    return '<tr><td><input id="new-issue-title" type="text" placeholder="New issue Title" autofocus /><input id="new-issue-body" type="text" placeholder="Details (Optional)" /></td></tr>'
}

function showRepositories(repositories) {
    var elem = document.getElementById("repository-list");
    elem.innerHTML = makeTableRows(repositories, getDataForRepository);
}

function getDataForIssue(issue) {
    return "<td>" + makeLinkOpenInNewTab(issue["html_url"], issue["title"]) + "</td>";
}
function showIssuesForRepo(issues) {
    var elem = document.getElementById("issues-list");
    var newhtml = makeTableRows(issues, getDataForIssue);
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
    var string = $("#repo-filter input").val().toLowerCase();
    var repo;

    if (string.length > 0) {
        // which tag is captured will have to be changed, if the table is removed
        $("#repository-list tr").each(function (i, v) {
            if (v.children[0].children[0].text.indexOf(string) == -1) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    } else {
        $("#repository-list tr").show();
    }
}

function showIssues() {
    var repositoryUrl = makeRepositoryIssuesUrl(window.location.hash);
    github_GET(repositoryUrl, showIssuesForRepo);
}

$(document).on('keyup', "#repo-filter input", $.proxy(filterRepos, this));
$("#api-key").on('change', function () {
    github_GET(GITHUB_REPOSITORIES_URL, showRepositories);
});
$(document).ready(function () {
    github_GET(GITHUB_REPOSITORIES_URL, showRepositories);
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

    github_POST(JSON.stringify(data), makeRepositoryIssuesUrl(window.location.hash), function (response) {
        showIssues();
    });
}