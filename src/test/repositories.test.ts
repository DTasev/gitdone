import { expect } from 'chai';
import 'mocha';

import Mock from './mock';
import Issues from "../ts/issues";
import Github from "../ts/github";
import Pinned from "../ts/pin-manager";
import Milestones from "../ts/milestones";
import Repositories from "../ts/repositories";
import CredentialForm from '../ts/credential-form';
import { Filter } from '../ts/filter-options';

function mockData() {
    // very trimmed repository data, only the relevant fields are left
    return [
        {
            "name": "gitdone",
            "full_name": "DTasev/gitdone",
            "html_url": "https://github.com/DTasev/gitdone"
        },
        {
            "name": "gitignore",
            "full_name": "DTasev/gitignore",
            "html_url": "https://github.com/DTasev/gitignore"
        }
    ];
}
function mockGithubGet(url, callback) {
    callback(mockData());
}

function mockRepositoryList(): HTMLElement {
    const list = document.createElement("div");
    list.id = Repositories.ID_REPOSITORY_LIST;
    document.body.appendChild(list);
    return list;
}

function mockFilters(): HTMLElement {
    const div = document.createElement("div");
    div.id = Filter.ID_FILTER_OPTIONS;
    document.body.appendChild(div);
    return div;
}

function Potatoes() { }
describe('Repositories', () => {
    beforeEach(() => {
        mockFilters();
        Github.GET = mockGithubGet;

        this.list = mockRepositoryList();
        this.issues_mock = new Mock();
        this.issues_mock.set(Issues, Issues.retrieve);

        this.credentials_mock = new Mock();
        this.credentials_mock.set(CredentialForm, CredentialForm.hide);

        this.pinned_mock = new Mock();
        this.pinned_mock.set(Pinned, Pinned.reorder, (return_value) => this.pinned_mock.mock(return_value));
    });
    afterEach(() => {
        document.body.innerHTML = "";

        this.issues_mock.restore();
        this.credentials_mock.restore();
        this.pinned_mock.restore();
        this.list = null;
    });
    it('should retrieve remote repositories', () => {
        Repositories.retrieve();
        // we have added only 2 repositories
        expect(this.list.childElementCount).to.equal(2);
        expect(this.issues_mock.called.once()).to.be.true;
        expect(this.credentials_mock.called.once()).to.be.true;
    })
    it('should show repositories correctly', () => {
        Repositories.retrieve();
        // we have added only 2 repositories
        expect(this.list.childElementCount).to.equal(2);
        for (const [id, repo] of this.list.childNodes.entries()) {
            expect(repo.id).to.equal(Repositories.ID_REPO_PREFIX + id);
            // there should be the repo name, pin and external link
            expect(repo.childElementCount).to.equal(3);
        }

    })
    it('should be able to use repositories from cache', () => {
        Repositories.repo_cache = mockData();
        Repositories.retrieve(true);

        // should show the same thing
        expect(this.list.childElementCount).to.equal(2);
        for (const [id, repo] of this.list.childNodes.entries()) {
            expect(repo.id).to.equal(Repositories.ID_REPO_PREFIX + id);
            // there should be the repo name, pin and external link
            expect(repo.childElementCount).to.equal(3);
        }
    })
});