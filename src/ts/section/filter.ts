import * as $ from "jquery";
import { J2H } from "../json2html";

import Issues from "./issues";

export default class Filter {
    static ID = "filter-options";
    static ASSIGNEE = "assignee"
    static CREATOR = "creator"
    private static CLASS_ACTIVE = "w3-black";
    private static CLASS_INACTIVE = "w3-white";
    private static value = "";

    static create() {
        const options = document.getElementById(Filter.ID);

        // clear all HTML from previous filter create calls
        options.innerHTML = "";

        const text = J2H.parse<HTMLSpanElement>({
            "span": {
                "className": "w3-margin-right",
                "textContent": "Filter:"
            }
        });
        options.appendChild(text);
        const all: HTMLButtonElement = J2H.parse<HTMLButtonElement>({
            "button": {
                "className": "w3-button " + Filter.CLASS_ACTIVE,
                "textContent": "ALL",
                "onclick": "Filter.set(this, '');"
            }
        });
        options.appendChild(all);
        const assigned: HTMLButtonElement = J2H.parse<HTMLButtonElement>({
            "button": {
                "className": "w3-button " + Filter.CLASS_INACTIVE,
                "textContent": "ASSIGNED",
                "onclick": "Filter.set(this, Filter.ASSIGNEE);"
            }
        });
        options.appendChild(assigned);
        const creator: HTMLButtonElement = J2H.parse<HTMLButtonElement>({
            "button": {
                "className": "w3-button " + Filter.CLASS_INACTIVE,
                "textContent": "CREATED",
                "onclick": "Filter.set(this, Filter.CREATOR);"
            }
        });
        options.appendChild(creator);
    }
    static set(caller: HTMLElement, value: string) {
        const filter_options: HTMLElement = document.getElementById(Filter.ID);
        // remove the active class from every button
        for (const option of filter_options.children) {
            option.className = option.className.replace(Filter.CLASS_ACTIVE, Filter.CLASS_INACTIVE);
        }
        caller.className = caller.className.replace(Filter.CLASS_INACTIVE, Filter.CLASS_ACTIVE);
        switch (value) {
            case "":
                Filter.value = value;
                break;
            case Filter.ASSIGNEE:
                Filter.value = Filter.ASSIGNEE + "=" + $("#username input").val();
                break;
            case Filter.CREATOR:
                Filter.value = Filter.CREATOR + "=" + $("#username input").val();
                break;
        }

        Issues.retrieve();
    }
    static option(): any {
        return Filter.value;
    }
}