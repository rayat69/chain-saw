import { useState, useCallback, useMemo } from 'react'

const useSwipe: UseSwipe = (
  direction,
  minSwipeLength,
  maxSwipeDuration,
  callback
) => {
  const initialState = useMemo(
    () => ({
      x: 0,
      y: 0,
      time: 0,
    }),
    []
  )
  const [swipeState, setSwipeState] = useState(initialState)

  const isDirection = useCallback(
    (touchObj: React.Touch) => {
      const distY = touchObj.pageY - swipeState.y
      const distX = touchObj.pageX - swipeState.x

      const opositeDirY = Math.abs(touchObj.pageX - swipeState.x) <= 100
      const opositeDirX = Math.abs(touchObj.pageY - swipeState.y) <= 100
      switch (direction) {
        case 'up':
          return distY <= -minSwipeLength && opositeDirY
        case 'down':
          return distY >= minSwipeLength && opositeDirY
        case 'left':
          return distX <= -minSwipeLength && opositeDirX
        case 'right':
          return distX >= minSwipeLength && opositeDirX

        default:
          return false
      }
    },
    [minSwipeLength, swipeState, direction]
  )

  const start: React.TouchEventHandler = useCallback(e => {
    e.preventDefault()
    const { pageX, pageY } = e.changedTouches[0]
    setSwipeState({ x: pageX, y: pageY, time: new Date().getTime() })
  }, [])

  const move: React.TouchEventHandler = useCallback(e => {
    e.preventDefault()
  }, [])

  const end: React.TouchEventHandler = useCallback(
    e => {
      e.preventDefault()
      var touchObj = e.changedTouches[0]

      const elapsedTime = new Date().getTime() - swipeState.time

      if (elapsedTime <= maxSwipeDuration && isDirection(touchObj)) {
        callback(e)
      }
      setSwipeState(initialState)
    },
    [swipeState, maxSwipeDuration, callback, isDirection, initialState]
  )

  return [start, move, end]
}

export default useSwipe

type Handler<T = Element> = React.TouchEventHandler<T>
type SwipeDir = 'up' | 'down' | 'left' | 'right'
type UseSwipe = (
  direction: SwipeDir,
  minSwipeLength: number,
  maxSwipeDuration: number,
  callback: React.TouchEventHandler
) => [Handler, Handler, Handler]
