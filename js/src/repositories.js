function Repositories() {
    var self = this;
    self.repo_cache = null;
}
Repositories.retrieve = function (use_cached = false) {
    if (use_cached && self.repo_cache) {
        // Don't query github for the repositories, and use the cache
        Repositories.show(self.repo_cache);
    }
    else {
        Github.GET(Github.REPOSITORIES_URL, Repositories.show);
    }
}
Repositories.show = function (repositories) {
    var repo_list = document.getElementById("repository-list");
    self.repo_cache = repositories;
    repo_list.innerHTML = Repositories.makeRows(repositories);
}

Repositories.makeLink = function (address, name) {
    var elem_a = document.createElement('a');
    elem_a.href = encodeURI(address);
    elem_a.appendChild(document.createTextNode(name));
    return elem_a;
}

Repositories.makeRows = function (json_data) {
    let rows = [];
    for (let entry of json_data.entries()) {
        rows.push(Repositories.buildRow(entry));
    }
    rows = Pinned.reorder(rows);
    return rows.reduce((prev, current) => prev += current.outerHTML, "");
}

Repositories.buildRow = function (id_entry_tuple) {
    let id = id_entry_tuple[0];
    let entry = id_entry_tuple[1];

    var link = Repositories.makeLink("#" + entry["full_name"], entry["name"]);
    link.className = "repo-link w3-button w3-padding w3-text-teal w3-col s8 m8 l8";
    link.setAttribute('onclick', "w3_close();");

    var ext_link = document.createElement("a");
    var ext_img = document.createElement("img");
    ext_link.href = entry["html_url"];
    ext_link.target = "_blank";
    ext_img.src = ImageUrl.EXTERNAL;
    ext_link.appendChild(ext_img);
    ext_link.className = "w3-button w3-padding w3-text-teal w3-hover-opacity w3-col s2 m2 l2";

    var pin_span = document.createElement("span");
    var pin_img = document.createElement("img");
    pin_img.src = ImageUrl.PIN;
    pin_span.appendChild(pin_img);
    pin_span.setAttribute('onclick', 'Pinned.addOrRemove(' + id + ');');

    pin_span.className = "w3-button w3-padding w3-text-teal w3-hover-opacity w3-col s2 m2 l2";
    $(pin_span).on('click', $.proxy(Pinned.addOrRemove, this));
    var div = document.createElement("div");
    div.className = "w3-row";
    div.id = 'repo_' + id;
    div.appendChild(link);
    div.appendChild(pin_span);
    div.appendChild(ext_link);

    return div;
}