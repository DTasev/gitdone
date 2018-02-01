import $ from "./lib/jquery-3.2.1";
import Github from './build/github';
import Repositories from './build/repositories';
import Issues from './build/issues';
import Milestones from './build/milestones';

// Global objects, accessible to the HTML
import Pinned from './build/pin-manager';
window.Pinned = Pinned;
import Controls from './build/site-controls';
window.Controls = Controls;

$(document).on('keyup', "#repo-filter input", $.proxy(Repositories.filterRepositories, this));
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