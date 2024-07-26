/**
 *
 * @param url
 * @param fileName  如果 type 为 post，使用的是 blob 方式下载，fileName 必需
 * @param type  默认 get，后端需设置响应头 【Content-Disposition: attachment; filename="filename.jpg"】 ，filename是文件名
 * @param params type 为 post 方式时的请求体参数
 */
downloadFile = (url, fileName, type = 'get', params = {}) => {
    if (type === 'post') {
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        })
            .then(response => {
                if (response.status !== 200)
                    return
                return response.blob()
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob)
                this.aDownload(url, fileName)
            })
            .catch(console.error);

    } else {
        window.open(url, "_blank")
    }
};

/**
 * 同源（同域名、同协议、同端口号）时，可以使用此方式
 * @param url
 * @param fileName
 */
aDownload = (url, fileName) => {
    const a = document.createElement('a')
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url)
}