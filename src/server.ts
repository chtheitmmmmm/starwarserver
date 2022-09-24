import {writelog} from "./writelog";

const net = require('net')
import {rsvdt_first} from "./rsvdt";
import {ipv6, ok, port} from "./constants";
import {app} from "./app";

const server = net.createServer(socket => {
    if (socket.address().family === 'IPv6') {
        writelog(Buffer.from(""), socket, ipv6);
        socket.end()
        return
    }
    socket.once('data', code => {
        const sym = rsvdt_first(code)
        if (sym !== ok) {
            socket.end()    // 关闭套接字
        } else {
            app.add(socket, code)   // 准许用户进入
        }
        writelog(code, socket, sym)
    })
})


server.listen(port)