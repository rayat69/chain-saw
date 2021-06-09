import { useEffect } from 'react'
import { Socket } from 'socket.io-client'

export const useSocket = (socket: Socket) => {
  useEffect(() => {
    socket.connect()
    return () => {
      if (socket.connected) {
        socket.disconnect()
      }
    }
  }, [socket])
}
