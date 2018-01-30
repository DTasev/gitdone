import $ from "../lib/jquery-3.2.1";
import Repositories from './repositories';

export default class Pinned {
    static LOCAL_STORAGE_NAME = "gitdone_pinned";

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
        } else {
            window.localStorage.setItem(Pinned.LOCAL_STORAGE_NAME, name);
        }
    }

    static remove(to_be_removed) {
        let current = Pinned.getList();
        current.splice(current.indexOf(to_be_removed), 1);
        // overwrite the existing entry
        Pinned.add(current, false);
    }

    static addOrRemove(id) {
        let chosen_repo = $("#repo_" + id + " a")[0].text;
        let current = Pinned.get();
        // use the comma-separated string returned by get
        // adding the coma at the end removes the possibility of
        // partially matching a string, e.g. dawdle-web and dawdle-web-secret
        // with the coma dawdle-web, and dawedle-web-secret, will not match!
        if (!current || current.indexOf(chosen_repo + ',') == -1) {
            Pinned.add(chosen_repo);
            $("#repo_" + id + " i")[0].className = 'fa fa-thumb-tack';
        } else {
            Pinned.remove(chosen_repo);
            $("#repo_" + id + " i")[0].className = 'fa fa-check';
        }
        // refresh the repository list using cached repositories
        Repositories.retrieve(true);
        // clear the filter input field
        $('#repo-filter input').val("");
    }
    static reorder(rows) {
        let new_rows = [], indices_to_remove = [];
        let current = Pinned.getList();
        // if storage is empty, just return
        if (!current || current.length == 1 && current[0] === "") {
            return rows;
        }
        let elemenets_to_append = current.length;

        // iterate through each row
        let ind, row, row_text;
        for (let row_tuple of rows.entries()) {
            ind = row_tuple[0];
            // get the text from the <a> element
            row = row_tuple[1];
            row_text = row.children[0].text;

            // check if the repository is pinned
            for (let pinned of current) {
                if (row_text === pinned) { // if this is the pinned repository
                    // change the pin icon to pinned
                    row.children[1].children[0].className = 'fa fa-check';
                    // store the changed row
                    new_rows.push(row);
                    // store the index to be removed from the original list later
                    indices_to_remove.push(ind);
                    elemenets_to_append -= 1;
                    // we can't have more than one match, as every repository is contained
                    // only once, so we break out of the loop early
                    break;
                }
            }
            if (elemenets_to_append == 0) {
                break;
            }
        }

        // remove the rows form the original list in reverse order
        // because the repositories are first traversed in ascending (increasing) order
        // we have to remove them in reverse, otherwise elements will be skipped:
        // deleting 3 and 4 -> delete 3, element 4 becomes 3, element 5 becomes 4
        // then we delete 4, which is now original element 5
        for (let i of indices_to_remove.reverse()) {
            rows.splice(i, 1);
        }
        // concat the old rows to the new rows, this will make the new rows appear on top
        return new_rows.concat(rows);
    }
}