const lowerize = obj => Object.keys(obj).reduce((acc, k) => {
    acc[k.toLowerCase()] = obj[k];
    return acc;
}, {});


function lowercaseKeys(obj) {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v])
    );
}

lowerCaseObjectKeys = (arr) => {
    return arr.map(obj => {
        return lowercaseKeys(obj)
    });
}

Object.keys(obj).forEach(key => {
    const value = obj[key];
    delete obj[key];
    obj[key.toLowerCase()] = value;
});
