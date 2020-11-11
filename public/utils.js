/** Helper : to debounce an action for a certain period */
const debounce = (cb, delay = 1000) => {
    let timeoutId;
    return (...args) => {
        // a trick to make sure we're waiting for the given period of delay before taking action !
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            cb.apply(null, args)
        }, delay);
    }
}