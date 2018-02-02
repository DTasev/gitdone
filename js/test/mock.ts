import assert from 'chai';

function mock() {
    const m = new Mock();
    return m.mock;
}
export default class Mock {
    original_function: any;
    called: boolean;

    backup(func) {
        this.original_function = func;
        this.called = false;
    }
    restore(): any {
        return this.original_function;
    }
    mock() {
        this.called = true;
    }
}