function Pinned() { }

Pinned.LOCAL_STORAGE_NAME = "gitdone_pinned";

Pinned.get = function () {
    return window.localStorage.getItem(Pinned.LOCAL_STORAGE_NAME);
}

Pinned.getList = function () {
    let current = window.localStorage.getItem(Pinned.LOCAL_STORAGE_NAME);
    if (current) {
        return current.split(',');
    }
    return null;
}

Pinned.isPinned = function (name) {
    return Pinned.get().indexOf(name) != -1;
}

Pinned.add = function (name, append = true) {
    const current = window.localStorage.getItem(Pinned.LOCAL_STORAGE_NAME);
    if (current && append) {
        window.localStorage.setItem(Pinned.LOCAL_STORAGE_NAME, [current, name]);
    } else {
        window.localStorage.setItem(Pinned.LOCAL_STORAGE_NAME, name);
    }
}

Pinned.remove = function (to_be_removed) {
    let current = Pinned.getList();
    current.splice(current.indexOf(to_be_removed), 1);
    // overwrite the existing entry
    Pinned.add(current, false);
}

Pinned.addOrRemove = function (id) {
    let chosen_repo = $("#repo_" + id + " a")[0].text;
    let current = Pinned.get();
    if (!current || current.indexOf(chosen_repo) == -1) {
        Pinned.add(chosen_repo);
        $("#repo_" + id + " img")[0].src = ImageUrl.PINNED;
    } else {
        Pinned.remove(chosen_repo);
        $("#repo_" + id + " img")[0].src = ImageUrl.PIN;
    }
}
Pinned.reorder = function (rows) {
    let new_rows = [], indices_to_remove = [];
    let current = Pinned.getList();
    // if storage is empty, just return
    if (!current || current.length == 1 && current[0] === "") {
        return rows;
    }
    let elemenets_to_append = current.length;

    debugger;
    // iterate through each row
    let ind, row, row_text;
    for (let row_tuple of rows.entries()) {
        ind = row_tuple[0];
        // get the text from the <a> element
        row = row_tuple[1];
        row_text = row.children[0].text;

        // check if the repository is pinned
        for (let pinned of current) {
            let index_in_row = row_text.indexOf(pinned);
            if (index_in_row != -1) { // if this is the pinned repository
                // change the pin icon to pinned
                row.children[1].children[0].src = ImageUrl.PINNED;
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