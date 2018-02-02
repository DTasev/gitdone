import { expect, assert } from 'chai';
import 'mocha';

import Milestones from "../ts/milestones";
import Issues from "../ts/issues";
import Github from "../ts/github";

/**
 * Mock of the Github GET function
 */
Github.GET = function (repo, callback) {
    let some_real_milestone_data = [
        {
            "url": "https://api.github.com/repos/DTasev/gitdone/milestones/2",
            "html_url": "https://github.com/DTasev/gitdone/milestone/2",
            "labels_url": "https://api.github.com/repos/DTasev/gitdone/milestones/2/labels",
            "id": 3078831,
            "number": 2,
            "title": "Apples",
            "description": "",
            "creator": {
                "login": "DTasev",
                "id": 9135965,
                "avatar_url": "https://avatars3.githubusercontent.com/u/9135965?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/DTasev", "html_url": "https://github.com/DTasev", "followers_url": "https://api.github.com/users/DTasev/followers", "following_url": "https://api.github.com/users/DTasev/following{/other_user}", "gists_url": "https://api.github.com/users/DTasev/gists{/gist_id}", "starred_url": "https://api.github.com/users/DTasev/starred{/owner}{/repo}", "subscriptions_url": "https://api.github.com/users/DTasev/subscriptions", "organizations_url": "https://api.github.com/users/DTasev/orgs", "repos_url": "https://api.github.com/users/DTasev/repos", "events_url": "https://api.github.com/users/DTasev/events{/privacy}", "received_events_url": "https://api.github.com/users/DTasev/received_events", "type": "User", "site_admin": false
            }, "open_issues": 0,
            "closed_issues": 2,
            "state": "open",
            "created_at": "2018-01-31T17:24:51Z",
            "updated_at": "2018-02-01T15:59:07Z",
            "due_on": null,
            "closed_at": null
        },
        {
            "url": "https://api.github.com/repos/DTasev/gitdone/milestones/1",
            "html_url": "https://github.com/DTasev/gitdone/milestone/1",
            "labels_url": "https://api.github.com/repos/DTasev/gitdone/milestones/1/labels",
            "id": 3078622,
            "number": 1,
            "title": "Test milestone",
            "description": "",
            "creator": {
                "login": "DTasev",
                "id": 9135965, "avatar_url": "https://avatars3.githubusercontent.com/u/9135965?v=4", "gravatar_id": "", "url": "https://api.github.com/users/DTasev", "html_url": "https://github.com/DTasev", "followers_url": "https://api.github.com/users/DTasev/followers", "following_url": "https://api.github.com/users/DTasev/following{/other_user}", "gists_url": "https://api.github.com/users/DTasev/gists{/gist_id}", "starred_url": "https://api.github.com/users/DTasev/starred{/owner}{/repo}", "subscriptions_url": "https://api.github.com/users/DTasev/subscriptions", "organizations_url": "https://api.github.com/users/DTasev/orgs", "repos_url": "https://api.github.com/users/DTasev/repos", "events_url": "https://api.github.com/users/DTasev/events{/privacy}", "received_events_url": "https://api.github.com/users/DTasev/received_events", "type": "User", "site_admin": false
            }, "open_issues": 0,
            "closed_issues": 4,
            "state": "open",
            "created_at": "2018-01-31T16:23:54Z",
            "updated_at": "2018-02-01T15:59:07Z",
            "due_on": null,
            "closed_at": null
        }
    ];
    // call the callback
    callback(some_real_milestone_data);
}

function mockMilestonesButton(): HTMLElement {
    let e = Milestones.buildButton();
    document.body.appendChild(e);
    return e;
}

/**
 * Create a div tag with the milestone list ID, then add it to the document body
 */
function mockMilestonesList(): HTMLElement {
    let e = Milestones.buildList();
    document.body.appendChild(e);
    return e;
}

/**
 * Insert some data into the milestones list
 */
function seedMilestonesList(): HTMLElement {
    let e = mockMilestonesList();
    let mock_milestones = [
        { 'title': 'apples', 'number': 3 },
        { 'title': 'apples', 'number': 3 },
        { 'title': 'apples', 'number': 3 },
    ];
    Milestones.create(mock_milestones);
    return e;
}

describe("Milestones", () => {
    afterEach(() => { // clear all html from the document
        document.body.innerHTML = "";
    })
    it("should retrieve milestones", () => {
        let list = mockMilestonesList();
        window.location.hash = "#DTasev/apples";
        Milestones.retrieve();

        expect(list.childElementCount).to.equal(2);
        expect(list.children[0].textContent).to.equal("Apples");
        expect(list.children[1].textContent).to.equal("Test milestone");

        expect((<HTMLElement>list.children[0]).dataset.milestoneNumber).to.equal('2');
        expect((<HTMLElement>list.children[1]).dataset.milestoneNumber).to.equal('1');
    })
    it("should correctly create milestones", () => {
        const e = seedMilestonesList();

        for (let i = 0; i < e.childElementCount; ++i) {
            const current = e.children[i];
            expect(current.textContent).to.equal("apples");
            expect((<HTMLElement>current).dataset.milestoneNumber).to.equal('3');
        }
    })
    it("should select the milestone the user clicked on", () => {
        let button = mockMilestonesButton();
        let list = seedMilestonesList();
        let id = 1;

        // sanity check for development
        assert(id < list.childElementCount);

        // first click activates milestone
        Milestones.markActiveMilestone(id);
        let selected = list.children[id];
        expect(selected.id).to.equal(Milestones.ID_ACTIVE_CHOICE);

        // second click to another milestone should move the active milestone
        id = 0;
        Milestones.markActiveMilestone(id);
        selected = list.children[id];
        expect(selected.id).to.equal(Milestones.ID_ACTIVE_CHOICE);

        // third click on the same milestone should disable the milestone
        Milestones.markActiveMilestone(id);
        selected = list.children[id];
        expect(selected.id).to.not.equal(Milestones.ID_ACTIVE_CHOICE);
    })
});