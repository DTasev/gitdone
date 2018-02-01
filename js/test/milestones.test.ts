import { expect } from 'chai';
import 'mocha';

import Milestones from "../ts/milestones";
import Issues from "../ts/issues";

describe("Milestones create", () => {
    it("should create the correct number of milestones", () => {
        let e = document.createElement("div");
        e.id = Issues.ID_NEW_ISSUE_MILESTONES_LIST;
        document.body.appendChild(e);
        let mock_milestones = [
            { 'title': 'apples', 'number': 3 },
            { 'title': 'apples', 'number': 3 },
            { 'title': 'apples', 'number': 3 },
        ];
        Milestones.create(mock_milestones);

        for (let i = 0; i < e.childElementCount; ++i) {
            let current = e.children[i];
            expect(current.textContent).to.be.equal("apples");
            expect((<HTMLElement>current).dataset.milestoneNumber).to.be.equal('3');
        }
        // const result = Milestones.("#apples/potatoes");
        // expect(result).to.be.equal("Hello world!");
    });
});