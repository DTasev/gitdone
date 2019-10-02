import { expect, assert } from 'chai';
import 'mocha';

import Mock from './mock';
import Issues from "../ts/section/issues";
import Github from "../ts/github";
import Milestones from "../ts/section/milestones";
import Repositories from "../ts/section/repositories";

const ISSUE_1_BODY = "I eat apples";
const ISSUE_2_BODY = "Oranges are orange";

function mockGithubGet(url, callback) {
    // NOTE: some data has be omitted to shorten the lines, as it is not currently used
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
        "milestone": null,
        "comments": 0,
        "created_at": "2018-02-01T16:18:06Z",
        "updated_at": "2018-02-01T16:18:06Z",
        "closed_at": null,
        "author_association": "OWNER",
        "body": ISSUE_1_BODY,
        "assignees": [{
            "login": "DTasev",
            "html_url": "https://github.com/DTasev"
        }]
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
        "milestone": null,
        "comments": 0,
        "created_at": "2018-02-01T14:55:14Z",
        "updated_at": "2018-02-01T14:55:14Z",
        "closed_at": null,
        "author_association": "OWNER",
        "body": ISSUE_2_BODY,
        "assignees": [{
            "login": "DTasev",
            "html_url": "https://github.com/DTasev"
        }, { "login": "Duck", "html_url": "https://duckduckgo.com" }, { "login": "Duck", "html_url": "https://duckduckgo.com" }
        ]
    }];
    callback(some_real_issue_data);
}

/** 
 * Mocks the necessary elements to successfully execute functions from Issues.
 * The element that displays the repository name is created, but not returned.
 * 
 * @returns The list element that will contain the issues 
 */
function mockIssuesView(): HTMLDivElement {
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
    let list: HTMLDivElement;
    let milestone_mock: Mock;
    beforeEach(() => {
        Github.GET = mockGithubGet;
        // mock the location hash
        window.location.hash = "#DTasev/apples";
        list = mockIssuesView();

        // mock the milestones method called inside issues
        milestone_mock = new Mock();
        milestone_mock.set(Milestones, Milestones.retrieve);
    });
    afterEach(() => { // clear all html from the document
        document.body.innerHTML = "";
        // if this is not here, then tests in Milestones will fail
        milestone_mock.restore();
        // remove the reference to the element
        list = null;
    });
    it('should retrieve issues', () => {
        Issues.retrieve();

        // we expect 3 elements - 2 is the mock issue data, 1 is the input field
        // Milestones.retrieve = mock.restore();
        expect(list.childElementCount).to.equal(3);
    });
    it('should show issues correctly', () => {
        Issues.retrieve();

        // we expect 3 elements - 2 is the mock issue data, 1 is the input field
        // Milestones.retrieve = mock.restore();
        expect(list.childElementCount).to.equal(3);

        // the first one will be the new issue input fields
        const input_fields: HTMLElement = <HTMLElement>list.children[0];
        const title_input = input_fields.children[0];
        const details_input = input_fields.children[1];

        expect(title_input.id).to.equal(Issues.ID_NEW_ISSUE_TITLE);
        expect(details_input.id).to.equal(Issues.ID_NEW_ISSUE_DETAILS);
        // check that the milestones retrieve has been called
        expect(milestone_mock.called.once()).to.be.true;
    });
    it('should set up the elements for milestones', () => {
        Issues.retrieve();

        // we expect 3 elements - 2 is the mock issue data, 1 is the input field
        // Milestones.retrieve = mock.restore();
        expect(list.childElementCount).to.equal(3);

        // the first one will be the new issue input fields
        const input_fields: HTMLElement = <HTMLElement>list.children[0];

        // just checking that the elements necessary for the milestones are correctly added
        const milestones_div = input_fields.children[3];
        const milestones_button = milestones_div.children[0];
        const milestones_list = milestones_div.children[1];

        expect(milestones_button.id).to.equal(Issues.ID_NEW_ISSUE_MILESTONES_BUTTON);
        expect(milestones_list.id).to.equal(Issues.ID_NEW_ISSUE_MILESTONES_LIST);
        // check that the milestones retrieve has been called
        expect(milestone_mock.called.once()).to.be.true;
    });
    it('should have a Send button', () => {
        Issues.retrieve();

        // we expect 3 elements - 2 is the mock issue data, 1 is the input field
        // Milestones.retrieve = mock.restore();
        expect(list.childElementCount).to.equal(3);

        // the first one will be the new issue input fields
        const input_fields: HTMLElement = <HTMLElement>list.children[0];

        // just checking that the elements necessary for the milestones are correctly added
        const send_button = input_fields.children[2];

        expect(send_button.id).to.equal(Issues.ID_NEW_ISSUE_SEND_BUTTON);

    })
    it('should show issue detials as tooltip', () => {
        Issues.retrieve();

        // children[1] retrieves the row div from the whole list, children[0] then gets
        // the contents of the div itself, which is an anchor tag
        const issue_field_1: HTMLDivElement = <HTMLDivElement>list.children[1].children[0];
        // check that the anchor tag (children[0]) contains the proper title
        expect((<HTMLAnchorElement>issue_field_1.children[0]).title).to.equal(ISSUE_1_BODY);

        const issue_field_2: HTMLDivElement = <HTMLDivElement>list.children[2].children[0];
        expect((<HTMLAnchorElement>issue_field_2.children[0]).title).to.equal(ISSUE_2_BODY);
    });
    it('should have a link to the assignee', () => {
        Issues.retrieve();

        const expected_username_1 = "DTasev";
        const expected_username_2 = "Duck";
        const expected_html_url_1 = "https://github.com/DTasev";
        const expected_html_url_2 = "https://duckduckgo.com";
        // children[1] retrieves the row div from the whole list, the second children[1] gets
        // the div tag that wraps the assignee link
        const assignee_field_1: HTMLDivElement = <HTMLDivElement>list.children[1].children[1];
        // check that the anchor tag (children[0]) contains the proper title
        expect((<HTMLAnchorElement>assignee_field_1.children[0]).text).to.equal(expected_username_1);
        expect((<HTMLAnchorElement>assignee_field_1.children[0]).href).to.equal(expected_html_url_1);
        expect((<HTMLAnchorElement>assignee_field_1.children[0]).title).to.be.empty;

        // second issue has more than one member
        const assignee_field_2: HTMLDivElement = <HTMLDivElement>list.children[2].children[1];
        expect((<HTMLAnchorElement>assignee_field_2.children[0]).text).to.equal(expected_username_1 + "...");
        expect((<HTMLAnchorElement>assignee_field_2.children[0]).href).to.equal(expected_html_url_1);
        // the second one is repeated twice
        expect((<HTMLAnchorElement>assignee_field_2.children[0]).title).to.equal(expected_username_2 + ", " + expected_username_2);
    })
});