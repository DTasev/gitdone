import * as $ from '../lib/jquery-3.2.1';

import { P } from "./parser";
import Issues from "./issues";

export class Filter {
    static ID_FILTER_OPTIONS = "filter-options";
    static ASSIGNEE = "assignee"
    static CREATOR = "creator"
    private static CLASS_ACTIVE = "w3-black";
    private static CLASS_INACTIVE = "w3-white";
    private static value = "";

    static create() {
        const filter_options = document.getElementById(Filter.ID_FILTER_OPTIONS);
        const all: HTMLButtonElement = <HTMLButtonElement>P.json2html({
            "button": {
                "className": "w3-button " + Filter.CLASS_ACTIVE,
                "textContent": "ALL",
                "onclick": "Filter.set(this, '');"
            }
        });
        filter_options.appendChild(all);
        const assigned: HTMLButtonElement = <HTMLButtonElement>P.json2html({
            "button": {
                "className": "w3-button " + Filter.CLASS_INACTIVE,
                "textContent": "ASSIGNED",
                "onclick": "Filter.set(this, Filter.ASSIGNEE);"
            }
        });
        filter_options.appendChild(assigned);
        const creator: HTMLButtonElement = <HTMLButtonElement>P.json2html({
            "button": {
                "className": "w3-button " + Filter.CLASS_INACTIVE,
                "textContent": "CREATED",
                "onclick": "Filter.set(this, Filter.CREATOR);"
            }
        });
        filter_options.appendChild(creator);
    }
    static set(caller: HTMLElement, value: string) {
        const filter_options: HTMLElement = document.getElementById(Filter.ID_FILTER_OPTIONS);
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