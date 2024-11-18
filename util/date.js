// Date对象转换为字符串函数
export const timeToString = timeObj => {
    let str;
    let year = timeObj.getFullYear();
    let month = timeObj.getMonth() + 1;
    let date = timeObj.getDate();
    let time = timeObj.toTimeString().split(" ")[0];
    let rex = new RegExp(/:/g);
    str = year+"-"+month+"-"+date+" "+time.replace(rex,"-");
    return str;
}


/**
 * Date类型相差天数计算
 * @param start
 * @param end
 * @param ignoreTime 忽略时间部分
 * @returns {number}
 */
export const diffDays = (start, end, ignoreTime = false) => {
    let startDate = new Date(start)
    let endDate = new Date(end)

    if (ignoreTime) {
        // 设置时间部分为午夜开始
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
    }

    const differenceInMilliseconds = endDate - startDate;
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    return Math.floor(differenceInDays);
}

// convertDateFormat("09-01~10-01")
function convertDateFormat(dateString) {
    const [startDate, endDate] = dateString.split('~');

    const [startMonth, startDay] = startDate.split('-');
    const [endMonth, endDay] = endDate.split('-');

    const formattedStart = `${parseInt(startMonth)}月${parseInt(startDay)}日`;
    const formattedEnd = `${parseInt(endMonth)}月${parseInt(endDay)}日`;

    return `${formattedStart} ~ ${formattedEnd}`;
}