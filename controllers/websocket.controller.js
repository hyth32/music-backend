import { WebSocketServer as WS} from 'ws'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'

dotenv.config()

class WebSocketServer {
    static connections = new Map()

    static initialize(server) {
        server.on('upgrade', (req, socket, head) => {
            const urlParams = new URL(req.url, `http://${req.headers.host}`).searchParams
            const clientId = urlParams.get('id')

            if (!clientId) {
                socket.destroy()
                return
            }

            const wss = new WS({ noServer: true })
            wss.handleUpgrade(req, socket, head, (ws) => {
                this.setClientId(clientId, ws)
                ws.on('close', () => this.deleteClientId(clientId))
            })
        })
    }

    static createWsUrl(clientId) {
        return `ws://localhost:5000/ws?id=${clientId}`
    }

    static createConnectionId() {
        return uuidv4()
    }

    static sendMessage(clientId, data) {
        const ws = this.getClientId(clientId)
        if (ws) {
            ws.send(JSON.stringify(data))
            ws.close()
            this.deleteClientId(clientId)
        }
    }

    static getWSSConnections() {
        return WebSocketServer.connections
    }

    static setClientId(clientId, ws) {
        return (this.getWSSConnections()).set(clientId, ws)
    }

    static getClientId(clientId) {
        return (this.getWSSConnections()).get(clientId)
    }

    static deleteClientId(clientId) {
        return (this.getWSSConnections()).delete(clientId)
    }
}

export default WebSocketServer
