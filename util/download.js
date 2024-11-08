/**
 *
 * @param url
 * @param fileName
 * @param type
 * @param params
 */
downloadFile = (url, fileName, type = 'get', params = {}) => {
    // window.location.origin + window.origin.pathname
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
        this.aDownload(url, fileName)
    }
};


aDownload = (url, fileName) => {
    const a = document.createElement('a')
    document.body.appendChild(a);
    a.href = url;
    a.download = fileName;
    a.click();
    document.body.removeChild(a);
}