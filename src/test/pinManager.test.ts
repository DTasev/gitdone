import { expect } from 'chai';
import 'mocha';

import Pinned from "../ts/section/pinManager";
import Repositories from "../ts/section/repositories";
import Mock from './mock';
import LocalStorageMock from "./localStorageMock";

const REPOSITORY_COUNT = 5;
const REPOSITORY_NAMES = [
    "pears",
    "peaches",
    "peanuts",
    "olives",
    "apples"
];
function mockRepositoryList(): HTMLDivElement {
    const list = document.createElement("div");
    list.id = Repositories.ID_REPOSITORY_LIST;

    // add some mock elements
    for (let i = 0; i < REPOSITORY_COUNT; ++i) {
        const div = document.createElement("div");
        div.id = Repositories.ID_REPO_PREFIX + i;
        const repoName = document.createElement("a");
        repoName.text = REPOSITORY_NAMES[i];
        div.appendChild(repoName);

        // currently the layout looks like <span><i>...
        const repoPinButton = document.createElement("button");
        const repoPinButtonFAImage = document.createElement("i");

        repoPinButton.appendChild(repoPinButtonFAImage);
        div.appendChild(repoPinButton);

        const repoExternalLink = document.createElement("a");
        div.appendChild(repoExternalLink);

        list.appendChild(div);
    }
    document.body.appendChild(list);
    return list;
}

function mockRepositoryFilter(): HTMLDivElement {
    const div = document.createElement("div");
    div.id = Repositories.ID_REPO_FILTER;
    const input = document.createElement("input");
    input.value = "apples";
    div.appendChild(input);
    document.body.appendChild(div);
    return div;
}

function mockRepoRow(): HTMLButtonElement {
    const div = document.createElement("div");
    const repoName = document.createElement("a");
    repoName.text = "myreponame";
    div.appendChild(repoName);
    const pinButton = document.createElement("button");
    div.appendChild(pinButton);
    const repoLink = document.createElement("a");
    div.appendChild(repoLink);

    document.body.appendChild(div);
    return pinButton;
}

function getPinButtonClassNameFromRowDiv(parent_div: HTMLElement) {
    return parent_div.children[1].className;
}
describe('Pinning repositories', () => {
    let repository_mock: Mock;
    let repositoryList: HTMLDivElement;
    let repositoryFilter: HTMLDivElement;
    beforeEach(() => {
        // the window in jsdom doesn't have localStorage by default
        // 'as any' basically disables TypeScript type checking
        // https://github.com/Microsoft/TypeScript/issues/9448#issuecomment-324015051
        (window as any).localStorage = new LocalStorageMock();
        repositoryList = mockRepositoryList();
        repositoryFilter = mockRepositoryFilter();
        repository_mock = new Mock();
        repository_mock.set(Repositories, Repositories.retrieve);
    });
    afterEach(() => {
        // it is important to wipe the HTML from the page after each test
        // or other tests might be affected
        document.body.innerHTML = "";
        repositoryList = null;
        repository_mock.restore();
    });
    it('should pin a repository when clicked the first time', () => {
        const mockRow = mockRepoRow();
        Pinned.toggle(mockRow);
        // the filter input should have been cleared
        // first children[0]
        expect((<HTMLInputElement>repositoryFilter.children[0]).value).to.be.empty;
        // some class name should have been added, originally in the mock it is empty
        expect(mockRow.className).to.not.be.empty;
        expect(repository_mock.called.once()).to.be.true;
    });
    it('should unpin a repository when clicked the second time', () => {
        const mockRow = mockRepoRow();
        Pinned.toggle(mockRow);
        // the filter input should have been cleared
        expect((<HTMLInputElement>repositoryFilter.children[0]).value).to.be.empty;
        // some class name should have been added to change the pin icon, originally in the mock it is empty
        const first_click_class = mockRow.className;
        expect(first_click_class).to.not.be.empty;

        Pinned.toggle(mockRow);
        // the class should have changed, as the repository's pinned status has been changed
        expect(mockRow.className).to.not.equal(first_click_class);
        expect(repository_mock.called.twice()).to.be.true;
    })
    it('should put pinned repositories on top', () => {
        // pin the last repository
        const last_id = REPOSITORY_COUNT - 1;
        const toggledElement = <HTMLButtonElement>repositoryList.children[last_id].children[1];
        Pinned.toggle(toggledElement);
        // reorder the rows so that the pinned ones are on top
        // error: not iterable
        const rows = Pinned.reorder(<Array<HTMLDivElement>>Array.from(repositoryList.childNodes));
        // we pinned the last repository, which should have been moved to be first when pinned
        const first_row = rows[0];
        // check that the class was changed
        expect(getPinButtonClassNameFromRowDiv(first_row)).to.not.be.empty;
        // the last of the repository names should now be the first as it is pinned
        expect((<HTMLAnchorElement>first_row.children[0]).text).to.equal(REPOSITORY_NAMES[last_id]);
    })
    it('should put all pinned repositories on top', () => {
        // pin the last repository
        const last_id = REPOSITORY_COUNT - 1;
        let toggledElement = <HTMLButtonElement>repositoryList.children[last_id].children[1];
        Pinned.toggle(toggledElement);
        toggledElement = <HTMLButtonElement>repositoryList.children[last_id - 1].children[1];
        Pinned.toggle(toggledElement);
        const rows = Pinned.reorder(<Array<HTMLDivElement>>Array.from(repositoryList.childNodes));

        // the pinned repositories should now be the first two
        const first_row = rows[0];
        const second_row = rows[1];

        expect(getPinButtonClassNameFromRowDiv(first_row)).to.not.be.empty;
        expect(getPinButtonClassNameFromRowDiv(second_row)).to.not.be.empty;

        // there isn't a particular order to the pinned repositories, they get put at the top first come first serve
        expect((<HTMLAnchorElement>first_row.children[0]).text).to.equal(REPOSITORY_NAMES[last_id - 1]);
        expect((<HTMLAnchorElement>second_row.children[0]).text).to.equal(REPOSITORY_NAMES[last_id]);
    })
});