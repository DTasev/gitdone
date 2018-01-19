var GITHUB_REPOSITORIES_URL = "https://api.github.com/user/repos?visibility=all";
var GITHUB_REPO_BASE_URL = "https://api.github.com/repos/";
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
        }
    };
    request.send(null);
}

function makeLink(address, name) {
    return "<a href=\"" + address + "\">" + name + "</a>";
}
function makeLinkOpenInNewTab(address, name) {
    return "<a href=\"" + address + "\" target=\"_blank\">" + name + "</a>";
}
function getDataForRepository(repo_entry) {
    return makeLink("#" + repo_entry["full_name"], repo_entry["name"]);
}
function makeTableRows(json_data, data_parsing_func) {
    var newhtml = "";
    for (var entry of json_data) {
        newhtml += "<tr><td>" + data_parsing_func(entry) + "</td></tr>";
    }
    return newhtml;
}

function makeIssueInputField() {
    return "<tr><td><input/></td></tr>" # TODO
}

function showRepositories(repositories) {
    var elem = document.getElementById("repository-list");
    elem.innerHTML = makeTableRows(repositories, getDataForRepository);
}

function getDataForIssue(issue) {
    return makeLinkOpenInNewTab(issue["html_url"], issue["title"]);
}
function showIssuesForRepo(issues) {
    var elem = document.getElementById("issues-list");
    var newhtml = makeTableRows(issues, getDataForIssue);
    elem.innerHTML = newhtml;
}

// Function specific to hiding the table rows
function filterRepos(e) {
    var string = $("#repo-filter input").val().toLowerCase();
    var repo;

    if (string.length > 0) {
        $("#repository-list tr").each(function (i, v) {
            // console.log(i, v.children[0].children[0].text);
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

$(document).on('keyup', "#repo-filter input", $.proxy(filterRepos, this));
$(window).on('hashchange', function () {
    if (window.location.hash.length > 1) {
        var repositoryUrl = makeRepositoryIssuesUrl(window.location.hash);
        github_GET(repositoryUrl, showIssuesForRepo);
    }
});

github_GET(GITHUB_REPOSITORIES_URL, showRepositories);