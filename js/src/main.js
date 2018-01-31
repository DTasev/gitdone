import $ from "../lib/jquery-3.2.1";
import Github from './github';
import Repositories from './repositories';
import Issues from './issues';
import Milestones from './milestones';

// Global objects, accessible to the HTML
import Pinned from './pin-manager';
window.Pinned = Pinned;
import Controls from './site-controls';
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
    Milestones.retrieve();
});