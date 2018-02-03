import { expect, assert } from 'chai';
import 'mocha';

import Mock from './mock';
import Issues from "../ts/issues";
import Github from "../ts/github";
import Milestones from "../ts/milestones";
import Repositories from "../ts/repositories";

function mockGithubGet(url, callback) {
    // NOTE: "body" and "user" have been omitted from the data, to shorten the lines, because
    // they are not currently used
    let some_real_issue_data = [{
        "url": "https://api.github.com/repos/DTasev/gitdone/issues/67",
        "repository_url": "https://api.github.com/repos/DTasev/gitdone",
        "labels_url": "https://api.github.com/repos/DTasev/gitdone/issues/67/labels{/name}",
        "comments_url": "https://api.github.com/repos/DTasev/gitdone/issues/67/comments",
        "events_url": "https://api.github.com/repos/DTasev/gitdone/issues/67/events",
        "html_url": "https://github.com/DTasev/gitdone/issues/67",
        "id": 293591526,
        "number": 67,
        "title": "Add testing",
        "labels": [],
        "state": "open",
        "locked": false,
        "assignee": null,
        "assignees": [],
        "milestone": null,
        "comments": 0,
        "created_at": "2018-02-01T16:18:06Z",
        "updated_at": "2018-02-01T16:18:06Z",
        "closed_at": null,
        "author_association": "OWNER",
    },
    {
        "url": "https://api.github.com/repos/DTasev/gitdone/issues/59",
        "repository_url": "https://api.github.com/repos/DTasev/gitdone",
        "labels_url": "https://api.github.com/repos/DTasev/gitdone/issues/59/labels{/name}",
        "comments_url": "https://api.github.com/repos/DTasev/gitdone/issues/59/comments",
        "events_url": "https://api.github.com/repos/DTasev/gitdone/issues/59/events",
        "html_url": "https://github.com/DTasev/gitdone/issues/59",
        "id": 293559708,
        "number": 59,
        "title": "Add help to start",
        "labels": [],
        "state": "open",
        "locked": false,
        "assignee": null,
        "assignees": [],
        "milestone": null,
        "comments": 0,
        "created_at": "2018-02-01T14:55:14Z",
        "updated_at": "2018-02-01T14:55:14Z",
        "closed_at": null,
        "author_association": "OWNER",
    }];
    callback(some_real_issue_data);
}

/** 
 * Mocks the necessary elements to successfully execute functions from Issues.
 * The element that displays the repository name is created, but not returned.
 * 
 * @returns The list element that will contain the issues 
 */
function mockIssuesView(): HTMLElement {
    const repo_name = document.createElement("b");
    repo_name.id = Repositories.ID_DISPLAY_REPOSITORY_NAME;
    document.body.appendChild(repo_name);
    // need to manually create the element, as it is inside index.html
    const list = document.createElement("div");
    list.id = Issues.ID_ISSUE_LIST;
    document.body.appendChild(list);
    return list;
}

describe('Issues', () => {
    beforeEach(() => {
        Github.GET = mockGithubGet;
        // mock the location hash
        window.location.hash = "#DTasev/apples";
        this.list = mockIssuesView();

        // mock the milestones method called inside issues
        this.mock = new Mock();
        this.mock.set(Milestones, Milestones.retrieve);
    });
    afterEach(() => { // clear all html from the document
        document.body.innerHTML = "";
        // if this is not here, then tests in Milestones will fail
        this.mock.restore();
        // remove the reference to the element
        this.list = null;
    });
    it('should retrieve issues', () => {
        Issues.retrieve();

        // we expect 3 elements - 2 is the mock issue data, 1 is the input field
        // Milestones.retrieve = mock.restore();
        expect(this.list.childElementCount).to.equal(3);
    });
    it('should show issues correctly', () => {
        Issues.retrieve();

        // we expect 3 elements - 2 is the mock issue data, 1 is the input field
        // Milestones.retrieve = mock.restore();
        expect(this.list.childElementCount).to.equal(3);

        // the first one will be the new issue input fields
        const input_fields: HTMLElement = <HTMLElement>this.list.children[0];
        const title_input = input_fields.children[0];
        const details_input = input_fields.children[1];

        expect(title_input.id).to.equal(Issues.ID_NEW_ISSUE_TITLE);
        expect(details_input.id).to.equal(Issues.ID_NEW_ISSUE_DETAILS);
        // check that the milestones retrieve has been called
        expect(this.mock.called.once()).to.be.true;
    });
    it('should set up the elements for milestones', () => {
        Issues.retrieve();

        // we expect 3 elements - 2 is the mock issue data, 1 is the input field
        // Milestones.retrieve = mock.restore();
        expect(this.list.childElementCount).to.equal(3);

        // the first one will be the new issue input fields
        const input_fields: HTMLElement = <HTMLElement>this.list.children[0];

        // just checking that the elements necessary for the milestones are correctly added
        const milestones_div = input_fields.children[2];
        const milestones_button = milestones_div.children[0];
        const milestones_list = milestones_div.children[1];

        expect(milestones_button.id).to.equal(Issues.ID_NEW_ISSUE_MILESTONES_BUTTON);
        expect(milestones_list.id).to.equal(Issues.ID_NEW_ISSUE_MILESTONES_LIST);
        // check that the milestones retrieve has been called
        expect(this.mock.called.once()).to.be.true;
    });
});