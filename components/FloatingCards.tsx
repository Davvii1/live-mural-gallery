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
    if (lastImageId > cardsRef.current.length && lastImageURL) {
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

