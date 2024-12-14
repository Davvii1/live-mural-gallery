'use client'

import { memo, useRef, useEffect } from 'react'
import { FloatingCard } from './FloatingCard'

interface FloatingCardsProps {
  lastImageId: number
  lastImageURL: string
}

export const FloatingCards = memo(function FloatingCards({ lastImageId, lastImageURL }: FloatingCardsProps) {
  const cardsRef = useRef<JSX.Element[]>([])
  const lastImageURLRef = useRef<string | null>(null)

  useEffect(() => {
    if (lastImageId > cardsRef.current.length && lastImageURL !== lastImageURLRef.current) {
      const newCard = (
        <FloatingCard
          key={lastImageId}
          imageUrl={lastImageURL}
          isNew={true}
        />
      )
      cardsRef.current = [...cardsRef.current, newCard]
      lastImageURLRef.current = lastImageURL
    }
  }, [lastImageId])

  return <>{cardsRef.current}</>
})

