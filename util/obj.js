const lowerize = obj => Object.keys(obj).reduce((acc, k) => {
    acc[k.toLowerCase()] = obj[k];
    return acc;
}, {});


function lowercaseKeys(object) {
    return Object.fromEntries(
        Object.entries(object).map(([key, value]) => [key.toLowerCase(), value])
    );
}

Object.keys(obj).forEach(key => {
    const value = obj[key];
    delete obj[key];
    obj[key.toLowerCase()] = value;
});
