'use client'

import { memo, useRef, useEffect, useState } from 'react'
import { FloatingCard } from './FloatingCard'

interface FloatingCardsProps {
  lastImageId: number
  lastImageURL: string
}

export const FloatingCards = memo(function FloatingCards({ lastImageId, lastImageURL }: FloatingCardsProps) {
  const cardsRef = useRef<JSX.Element[]>([])
  const [lastImageURLRef, setLastImageURLRef] = useState<string>("")

  useEffect(() => {
    if (lastImageId > cardsRef.current.length && lastImageURL !== lastImageURLRef) {
      const newCard = (
        <FloatingCard
          key={lastImageId}
          imageUrl={lastImageURL}
          isNew={true}
        />
      )
      cardsRef.current = [...cardsRef.current, newCard]
      setLastImageURLRef(lastImageURL)
    }
  }, [lastImageId])

  return <>{cardsRef.current}</>
})

