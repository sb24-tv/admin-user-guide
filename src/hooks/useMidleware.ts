import {LocalStorageKey} from "../enum";

export default function useMiddleware() {
    const getLocalStorage = window.localStorage.getItem(LocalStorageKey.USER);
    if (getLocalStorage) {
        return [true, JSON.parse(getLocalStorage)]
    }
    return [false, null]
}