import { expect, assert } from 'chai';
import 'mocha';

import Milestones from "../ts/milestones";
import Issues from "../ts/issues";


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
        let list = document.getElementById(Issues.ID_NEW_ISSUE_MILESTONES_LIST);
        if (list) {
            list.outerHTML = "";
        }
        let button = document.getElementById(Issues.ID_NEW_ISSUE_MILESTONES_BUTTON);
        if (button) {
            button.outerHTML = "";
        }
    })
    it("should correctly create milestones", () => {
        let e = seedMilestonesList();

        for (let i = 0; i < e.childElementCount; ++i) {
            let current = e.children[i];
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

        Milestones.markActiveMilestone(id);
        let selected = list.children[id];
        expect(selected.id).to.equal(Milestones.ID_ACTIVE_CHOICE);
    })
});