let localVideo,  // 显示自己的摄像头内容
    localStream, // 本地媒体流引用，用于传送给其它用户以显示自己的摄像头内容
    socket       // 连接服务器

// 存放房间里其它用户
const connects = new Map()

window.onload = () => {
    localVideo = document.getElementById("local")
}

function leave() {
    localStream.getTracks().forEach((track) => track.stop())
    for (const peer of connects) {
        peer[1].close()  // map 的键值对以 [key, value] 形式
    }
    socket.close()
}

function start() {
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then(stream => {
            startWebSocket() // 连接信令服务器
            localVideo.srcObject = stream
            localStream = stream
        })
        .catch(e => console.log("GetStreamError", e))
}


function startWebSocket() {
    if (!window.WebSocket) {
        alert("不支持WebSocket")
        return
    }

    // let url = `wss://域名/web/1/${uid}`
    let url = `ws://192.168.31.151:8080/socket`
    socket = new WebSocket(url)
    socket.onopen = onOpen
    socket.onclose = onClose
    socket.onmessage = onMessage
    socket.onerror = onError
}

function onOpen() {
    console.log('连接上咯')
    sendMsg('open', '我来也', null, '234324')
}

function onClose() {
    console.log("走了")
}

function onMessage(msg) {
    const data = JSON.parse(msg.data)
    switch (data.type) {
        case 'error':
            alert(data.content)
            break
        case 'message':
            console.log(data.content)
            break
        case 'meta':
            dealMessage(msg.content)

    }
}

function onError(err) {//连接出错回调
    alert(err)
}


function sendMsg(type, msg, targetId, roomId) {
    socket.send(JSON.stringify(
        {
            type: type,
            content: msg,
            targetId: targetId,
            roomId: roomId,
            time: new Date()
        }))
}

function createPeerConnection(id) {
    if (!window.RTCPeerConnection) {
        alert("不支持WebRTC！")
        return
    }

    // 配置turn服务穿透nat和防火墙
    const iceServer = {
        urls: 'turn:域名:3478',
        credential: 'coturn',
        username: '123456'
    }

    const configuration = {
        iceServers: [iceServer]
    }

    const peer = new RTCPeerConnection(configuration)
    // 本地媒体流分轨道（音频轨道、视频轨道）加入 peer 传输
    localStream.getTracks().forEach(track => {
        peer.addTrack(track);
    })

    // 监听本地网络端口，收集连接信息（将自己的连接信息提供给服务器，让别的用户有可以连接自己）
    peer.onicecandidate = function (e) {
        // 发现一个新的 ICE 候选
        if (e.candidate) {
            sendMsg("meta",
                JSON.stringify({
                    sdpMLineIndex: e.candidate.sdpMLineIndex,
                    sdpMid: e.candidate.sdpMid,
                    candidate: e.candidate.candidate
                }),
                id)
        }
    }

    let audioStream = null
    // 连接完成时，监听对方传来的媒体轨道
    peer.ontrack = function (e) {
        // 视频分轨
        if (e.track.kind === 'video') {
            const remoteVideo = document.createElement('video')
            remoteVideo.autoplay = true
            remoteVideo.srcObject = new MediaStream([e.track])
            document.body.appendChild(remoteVideo)
        } else {
            // 音频不分轨
            if (!audioStream) {
                audioStream = new MediaStream()
                const remoteAudio = document.createElement('audio')
                remoteAudio.srcObject = audioStream
            }
            audioStream.addTrack(e.track)
        }
    }

    connects.set(id, peer)
    return peer
}

function call(targetUserId) {

    const peer = createPeerConnection(targetUserId)

    // offer 是用于描述音视频流和网络传输信息
    peer.createOffer()
        .then(offer => peer.setLocalDescription(offer))  // 加入本地描述
        .then(() => sendMsg("meta", JSON.stringify(peer.localDescription), targetUserId)) // 向对方发送 offer
        .catch(e => console.log("Create Offer Error", e))
}

function dealMessage(message, targetUserId) {
    let msg = JSON.parse(message)
    console.log(msg)

    switch (msg.type) {
        case 'offer':
            // 收到连接请求
            const peer = createPeerConnection(targetUserId)

            peer.setRemoteDescription(msg).then(r => console.log('r', r))
            peer.createAnswer()
                .then(answer => peer.setLocalDescription(answer))
                .then(() => sendMsg("meta", JSON.stringify(peer.localDescription), targetUserId))
                .catch(e => console.log("createAnswerError", e))
            break;

        case 'answer':
            connects.get(targetUserId).setRemoteDescription(msg)
            break;

        default:
            connects.get(targetUserId).addIceCandidate(msg)
    }
}

