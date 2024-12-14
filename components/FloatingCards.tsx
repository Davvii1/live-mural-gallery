'use client'

import { memo, useRef, useEffect } from 'react'
import { FloatingCard } from './FloatingCard'

interface FloatingCardsProps {
  lastImageId: number
  lastImageURL: string
}

export const FloatingCards = memo(function FloatingCards({ lastImageId, lastImageURL }: FloatingCardsProps) {
  const cardsRef = useRef<JSX.Element[]>([])

  useEffect(() => {
    if (lastImageId > cardsRef.current.length) {
      const randomId = Math.floor(Math.random() * 1000)
      const imageUrl = `https://picsum.photos/seed/${randomId}/300/400`
      const newCard = (
        <FloatingCard
          key={lastImageId}
          imageUrl={lastImageURL}
          isNew={true}
        />
      )
      cardsRef.current = [...cardsRef.current, newCard]
    }
  }, [lastImageId])

  return <>{cardsRef.current}</>
})

