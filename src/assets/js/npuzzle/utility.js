/**
 * Utility class of helper functions.
 */
let Utility = {
    compareArrays(a1, a2) {
        return a1.length === a2.length && a1.every(function (v, i) { return v === a2[i] })
    }
};

export default Utility;
