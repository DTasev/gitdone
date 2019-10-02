import * as $ from "jquery";
import { LoadIcon } from './item/loadIcon';

type ResponseCallbackFunction = (x: any) => void;

export default class Github {
    // per_page=100 gives back 100 repositories, currently if a user has > 100 they won't be shown
    public static REPOSITORIES_URL = "https://api.github.com/user/repos?per_page=100";
    private static formatError(request): string {
        let error_message = "";

        if (request.responseText) {
            error_message = JSON.parse(request.responseText)["message"]
        }

        return "<p>" + error_message + "</p>";
    }

    /**
     *
     * @param response The HTTP Response from the server
     * @param expected_code The expected HTTP code for a successful end
     * @param callback Callback function
     */
    private static handleResponse(response: XMLHttpRequest, expected_code: number, callback: ResponseCallbackFunction) {
        // if the request isn't finished yet, don't do anything
        // it is possible the callback will trigger, before the request is fully finished
        if (response.readyState === XMLHttpRequest.DONE) {
            LoadIcon.hide();
            if (response.status === expected_code) {
                callback(JSON.parse(response.responseText));
                $("#error-message").html("");
            } else if (response.status === 204) {
                $("#error-message").html("204 No Content");
            } else if (response.status !== 204) {
                $("#error-message").html(Github.formatError(response));
            }
        }
    }

    public static GET(url: string, callback: ResponseCallbackFunction) {
        let request = new XMLHttpRequest();
        // const api_key = $("#api-key input").val();
        // if (api_key === "") {
        //     $("#error-message").html("No API key");
        //     return;
        // }
        // const auth_basic = window.btoa($("#username input").val() + ":" + $("#api-key input").val());
        request.open("GET", url, true);
        // request.setRequestHeader("Authorization", "Basic " + auth_basic);
        request.onreadystatechange = function () {
            // expecting 200 OK
            Github.handleResponse(request, 200, callback);
        };
        request.onerror = Github.showConnectionError();

        LoadIcon.show();
        request.send(null);
    }

    public static POST(data, url: string, callback: ResponseCallbackFunction) {
        let request = new XMLHttpRequest();
        let auth_basic = window.btoa($("#username input").val() + ":" + $("#api-key input").val());
        request.open("POST", url, true);
        request.setRequestHeader("Authorization", "Basic " + auth_basic);
        request.onreadystatechange = function () {
            // expecting 201 Created
            Github.handleResponse(request, 201, callback);
        };
        request.onerror = Github.showConnectionError();
        LoadIcon.show();

        request.send(data);
    }

    private static showConnectionError(): (this: XMLHttpRequest, ev: ProgressEvent | ErrorEvent) => any {
        return (e) => {
            const elem = document.getElementById("issues-error");
            elem.innerHTML = '<div class="w3-panel w3-red w3-padding" style="width:100%"> Coudln\'t reach remote.</div>';
            setTimeout(() => {
                elem.style.display = "none";
            }, 3000);
        };
    }
}