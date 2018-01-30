import $ from "../lib/jquery-3.2.1";
import LoadIcon from './load-icon';
export default class Github {
    static GET(url, callback) {
        let request = new XMLHttpRequest();
        const api_key = $("#api-key input").val();
        if (api_key === "") {
            $("#error-message").html("No API key");
            return;
        }
        const auth_basic = window.btoa($("#username input").val() + ":" + $("#api-key input").val());
        request.open("GET", url, true);
        request.setRequestHeader("Authorization", "Basic " + auth_basic);
        request.onreadystatechange = function () {
            // if the request isn't finished yet, don't do anything
            // it is possible the callback will trigger, before the request is fully finished
            if (request.readyState === XMLHttpRequest.DONE) {
                LoadIcon.hide();
                if (request.status === 200) {
                    callback(JSON.parse(request.responseText));
                    $("#error-message").html("");
                }
                else if (request.status !== 204) {
                    let error_message = "";
                    if (request.responseText) {
                        error_message = JSON.parse(request.responseText)["message"];
                    }
                    $("#error-message").html("<p>" + request.status + " " + error_message + "</p>");
                }
            }
        };
        LoadIcon.show();
        request.send(null);
    }
    static POST(data, url, callback) {
        let request = new XMLHttpRequest();
        let auth_basic = window.btoa($("#username input").val() + ":" + $("#api-key input").val());
        request.open("POST", url, true);
        request.setRequestHeader("Authorization", "Basic " + auth_basic);
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                LoadIcon.hide();
                if (request.status === 201) {
                    callback(JSON.parse(request.responseText));
                    $("#error-message").html("");
                }
                else if (request.status !== 204) {
                    $("#error-message").html("<p>" + request + "</p>");
                }
            }
        };
        LoadIcon.show();
        request.send(data);
    }
}
Github.REPOSITORIES_URL = "https://api.github.com/user/repos";
//# sourceMappingURL=github.js.map