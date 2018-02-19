/** 
 * Mock the bare minimum behaviour required for tests of classes that use
 * the localStorage to pass
*/
export default class LocalStorageMock {
    data: {};
    constructor() {
        this.data = {};
    }

    getItem(key: string) {
        return this.data[key];
    }
    setItem(key: string, val: string) {
        this.data[key] = val;
    }
}