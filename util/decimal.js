/**
 * 两位小数
 * @param num
 * @returns {number|boolean}
 */
keepTwoDecimal = (num) => {
    let result = parseFloat(num);
    if (isNaN(result)) {
        alert('传递参数错误，请检查！');
        return false;
    }
    result = Math.round(num * 100) / 100;
    return result;
};
