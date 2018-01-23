function Pinned() { }

Pinned.LOCAL_STORAGE_NAME = "gitdone_pinned";

Pinned.get = function () {
    return window.localStorage.getItem(Pinned.LOCAL_STORAGE_NAME);
}

Pinned.getList = function () {
    return window.localStorage.getItem(Pinned.LOCAL_STORAGE_NAME).split(',');
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
    current.splice(current.indexOf(to_be_removed));
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
    debugger;
    let new_rows = [];
    let current = Pinned.getList();

    for (let pinned of current) {
        let ind = rows.indexOf(pinned);
        if (ind != -1) {
            new_rows.push(rows.splice(ind));
        }
    }
    return new_rows.concat(rows);
}