import * as $ from "jquery";
import Github from './github';
import Repositories from './section/repositories';
import Issues from './section/issues';
import Milestones from './section/milestones';
import PullRequests from './section/pull_requests'

// Global objects, accessible to the HTML
import Pinned from './section/pinManager';
window["Pinned"] = Pinned;
import Controls from './siteControls';
window["Controls"] = Controls;
import Filter from "./section/filter";
(window as any).Filter = Filter;

$(document).on('keyup', "#repo-filter input", $.proxy(Repositories.filterRepositories, this));

$("#api-key").on('change', function () {
    Repositories.retrieve();
});

document.onreadystatechange = (ev) => {
    // if (document.readyState == "complete") {
    //     document.getElementById("api-key").click();
    //     Repositories.retrieve();
    // }
    PullRequests.retrieve(true);
}

$(window).on('hashchange', function () {
    // Issues.retrieve(true);
});