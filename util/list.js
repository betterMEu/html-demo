groupBy = (arr, prop) => {
    return arr.reduce((acc, curr) => {
        const key = curr[prop];
        acc[key] = [...(acc[key] || []), curr];
        return acc;
    }, {});
};