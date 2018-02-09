import * as $ from "../lib/jquery-3.2.1";
import Repositories from './repositories';
export default class Pinned {
    static get() {
        // add the comma at the end, to make sure the last entry does not
        // fail comparison for presence, simply because it doesn't have the
        // coma at the end, e.g. before: "apples,rails" - checking for "rails," fails
        // but now it will be "apples,rails," and the check will be correct
        return window.localStorage.getItem(Pinned.LOCAL_STORAGE_NAME) + ',';
    }
    static getList() {
        let current = window.localStorage.getItem(Pinned.LOCAL_STORAGE_NAME);
        if (current) {
            return current.split(',');
        }
        return null;
    }
    static add(name, append = true) {
        const current = window.localStorage.getItem(Pinned.LOCAL_STORAGE_NAME);
        if (current && append) {
            window.localStorage.setItem(Pinned.LOCAL_STORAGE_NAME, [current, name].join(','));
        }
        else {
            window.localStorage.setItem(Pinned.LOCAL_STORAGE_NAME, name);
        }
    }
    static remove(to_be_removed) {
        let current = Pinned.getList();
        current.splice(current.indexOf(to_be_removed), 1);
        // overwrite the existing entry
        Pinned.add(current, false);
    }
    /**
     * Toggle pinned status of the repository.
     * @param id ID in the repository list, not to be confused with the remote ID of the repository
     */
    static toggle(id) {
        const full_id = "#" + Repositories.ID_REPO_PREFIX + id;
        const chosen_repo = $(full_id + " a")[0].text;
        const pinned_repositories = Pinned.get();
        // use the comma-separated string returned by get
        // adding the coma at the end removes the possibility of
        // partially matching a string, e.g. dawdle-web and dawdle-web-secret
        // with the coma - "dawdle-web," will not match "dawdle-web-secret,"
        if (!pinned_repositories || pinned_repositories.indexOf(chosen_repo + ',') == -1) {
            Pinned.add(chosen_repo);
            $(full_id + " i")[0].className = 'fa fa-thumb-tack';
        }
        else {
            Pinned.remove(chosen_repo);
            $(full_id + " i")[0].className = 'fa fa-check';
        }
        // refresh the repository list using cached repositories
        Repositories.retrieve(true);
        // clear the filter input field
        $('#' + Repositories.ID_REPO_FILTER + ' input').val("");
    }
    /**
     * Re-order the repositories, so that the pinned repositories are at the top.
     *
     * There is no particular order forced (e.g. alphabetical), the order from the input
     * list will be kept. The pinned repositories will be moved to the top in first come
     * first serve way.
     *
     * Example input:
     * pears
     * green
     * apples -> pinned
     * tomatoes
     * oranges -> pinned
     *
     * Result:
     * apples -> pinned
     * oranges -> pinned
     * pears
     * green
     * tomatoes
     *
     *
     * @param rows The rows of repositories
     */
    static reorder(rows) {
        const new_rows = [];
        const indices_to_remove = [];
        const pinned_repositories = Pinned.getList();
        // if storage is empty, just return
        if (!pinned_repositories || pinned_repositories.length == 1 && pinned_repositories[0] === "") {
            return rows;
        }
        let elements_to_append = pinned_repositories.length;
        // iterate through each row
        let repository_name;
        for (const [ind, row] of rows.entries()) {
            repository_name = row.children[0].text;
            // check if the repository is pinned
            for (const current of pinned_repositories) {
                // if this is a pinned repository
                if (repository_name === current) {
                    // changes the pin icon
                    // currently children[1] gets the second element on the row, which is the pin icon
                    // and then children[0] gets the actual visual element <i>, and changes the CSS class
                    row.children[1].children[0].className = 'fa fa-check';
                    // store the changed row
                    new_rows.push(row);
                    // store the index to be removed from the original list later
                    indices_to_remove.push(ind);
                    elements_to_append -= 1;
                    // we can't have more than one match, as every repository is contained
                    // only once, so we break out of the loop early
                    break;
                }
            }
            // if all repositories in the cache have been pinned, exit the loop
            if (elements_to_append == 0) {
                break;
            }
        }
        // remove the rows form the original list in reverse order
        // because the repositories are first traversed in ascending (increasing) order
        // we have to remove them in reverse, otherwise elements will be skipped:
        // deleting 3 and 4 -> delete 3, element 4 becomes 3, element 5 becomes 4
        // then we delete 4, which is now original element 5
        for (const i of indices_to_remove.reverse()) {
            rows.splice(i, 1);
        }
        // concatinate all rows, this will make the new rows (pinned repositories) appear on top
        return new_rows.concat(rows);
    }
}
Pinned.LOCAL_STORAGE_NAME = "quickhub_pinned";
//# sourceMappingURL=pin-manager.js.map