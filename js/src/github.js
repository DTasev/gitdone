function Github() { }

Github.REPOSITORIES_URL = "https://api.github.com/user/repos";

Github.GET = function (url, callback) {
    var request = new XMLHttpRequest();
    var auth_basic = window.btoa($("#username input").val() + ":" + $("#api-key input").val());
    request.open("GET", url, true);
    request.setRequestHeader("Authorization", "Basic " + auth_basic);
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            callback(JSON.parse(request.responseText));
            $("#error-message").html("");
        } else {
            var error_message = "";
            if (request.responseText) {
                error_message = JSON.parse(request.responseText)["message"]
            }
            $("#error-message").html("<p>" + request.status + " " + error_message + "</p>");
        }
    };
    request.send(null);
}

Github.POST = function (data, url, callback) {
    var request = new XMLHttpRequest();
    var auth_basic = window.btoa($("#username input").val() + ":" + $("#api-key input").val());
    request.open("POST", url, true);
    request.setRequestHeader("Authorization", "Basic " + auth_basic);
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 201) {
            callback(JSON.parse(request.responseText));
            $("#error-message").html("");
        } else {
            $("#error-message").html("<p>" + request + "</p>");
        }
    };
    request.send(data);
}