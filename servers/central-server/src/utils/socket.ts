import { Server as SocketServer } from 'socket.io'
import { Server } from 'http'
import { CorsOptions } from 'cors'

export const socketIo = (server: Server, cors: CorsOptions) => {
  return new SocketServer(server, {
    cors,
  })
}
