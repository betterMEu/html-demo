// Date对象转换为字符串函数
function timeToString(timeObj){
    let str;
    let year = timeObj.getFullYear();
    let month = timeObj.getMonth() + 1;
    let date = timeObj.getDate();
    let time = timeObj.toTimeString().split(" ")[0];
    let rex = new RegExp(/:/g);
    str = year+"-"+month+"-"+date+" "+time.replace(rex,"-");
    return str;
}