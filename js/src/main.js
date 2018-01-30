import $ from "../lib/jquery-3.2.1";
import Github from './github';
import Repositories from './repositories';
import Issues from './issues';

function makeRepositoryIssuesUrl(hash) {
    return "https://api.github.com/repos/" + hash.substring(1) + "/issues";
}
window.makeRepositoryIssuesUrl = makeRepositoryIssuesUrl;

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
window.filterRepos = filterRepos;

function createNewIssue() {
    var data = {
        "title": $("#new-issue-title").val(),
        "body": $("#new-issue-body").val()
    };

    Github.POST(JSON.stringify(data), makeRepositoryIssuesUrl(window.location.hash), function (response) {
        Issues.retrieve();
    });
}

window.createNewIssue = createNewIssue;

$(document).on('keyup', "#repo-filter input", $.proxy(filterRepos, this));
$("#api-key").on('change', function () {
    Repositories.retrieve();
});
$(document).ready(function () {
    // simulate a click, this allows Chrome to set the credentials' field value
    // if we don't do this then api-key is empty on the first github GET
    document.getElementById("api-key").click();
    Repositories.retrieve();
});

$(window).on('hashchange', function () {
    Issues.retrieve();
});