var GITHUB_REPOSITORIES_URL = "https://api.github.com/user/repos";
var GITHUB_REPO_BASE_URL = "https://api.github.com/repos/";

// image used for the repository external link
var EXTERNAL_IMAGE_URL = encodeURI("https://i.imgur.com/1DpOZzv.png");
// image used for the pin functionality
var PIN_IMAGE_URL = encodeURI("https://i.imgur.com/ainCXW5.png");
var PINNED_IMAGE_URL = encodeURI("https://i.imgur.com/ux8ZZBl.png");

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
    img.src = EXTERNAL_IMAGE_URL;
    elem_a.appendChild(img);
    return elem_a.outerHTML;
}

function makeRows(json_data, data_parsing_func) {
    var newhtml = "";
    for (var entry of json_data) {
        newhtml += data_parsing_func(entry);
    }
    return newhtml;
}

function makeIssueInputField() {
    var outer_div = document.createElement("div");
    outer_div.className = "w3-row w3-dark-grey w3-padding";
    outer_div.innerHTML = '<input class="w3-input w3-border" id="new-issue-title" type="text" placeholder="New issue Title" autofocus /><input class="w3-input w3-border" id="new-issue-body" type="text" placeholder="Details (Optional)" />';
    return outer_div.outerHTML;
}

function showRepositories(repositories) {
    var elem = document.getElementById("repository-list");
    elem.innerHTML = makeRows(repositories, getRepositoryData);
}

function getRepositoryData(entry) {
    var link = makeLink("#" + entry["full_name"], entry["name"]);
    link.className = "repo-link w3-button w3-padding w3-text-teal w3-col m10 l10";
    var link_html = link.outerHTML;
    // this is killing me, but link.onclick=function(){w3_close();}; doesnt work!
    link_html = link_html.substring(0, 2) + ' onclick="w3_close()"' + link_html.substring(2);

    var ext_link = document.createElement("a");
    var ext_img = document.createElement("img");
    ext_link.href = entry["html_url"];
    ext_link.target = "_blank";
    ext_img.src = EXTERNAL_IMAGE_URL;
    ext_link.appendChild(ext_img);
    ext_link.className = "w3-button w3-padding w3-text-teal w3-hover-opacity w3-col m2 l2";

    // var span = document.createElement("span");
    // var pin_img = document.createElement("img");
    // pin_img.src = PIN_IMAGE_URL;
    // span.appendChild(pin_img);
    // span.className = "w3-button w3-padding w3-text-teal w3-hover-opacity w3-col m2 l2";

    return '<div class="w3-row">' + link_html + ext_link.outerHTML + '</div>';
    // return '<div class="w3-row">' + link_html + span.outerHTML + ext_link.outerHTML + '</div>';
}

function getIssueData(issue) {
    var outer_div = document.createElement("div");
    outer_div.className = "w3-row w3-dark-grey issue-margin-bottom";
    var new_tab_link_a = makeLinkOpenInNewTab(issue["html_url"], issue["title"] + " #" + issue["number"]);
    new_tab_link_a.className = "issue-link w3-text-sand w3-padding w3-block w3-ripple w3-hover-green";
    outer_div.appendChild(new_tab_link_a);
    return outer_div.outerHTML;
}

function showIssuesForRepo(issues) {
    var elem = document.getElementById("issues-list")
    var newhtml = makeRows(issues, getIssueData);
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
        $("#repository-list a").each(function (i, v) {
            if (v.text.indexOf(string) == -1) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    } else {
        $("#repository-list a").show();
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
    // simulate a click, this allows Chrome to set the credentials' field value
    // if we don't do this then api-key is empty on the first github GET
    document.getElementById("api-key").click();
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