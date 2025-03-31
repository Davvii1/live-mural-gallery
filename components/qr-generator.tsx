"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRGeneratorProps {
  url: string;
  id: string;
  index: number;
  totalQRs: number;
  size: number;
}

const pulseStyles = `
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 165, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 165, 0, 0);
  }
}`;

const QRGenerator: React.FC<QRGeneratorProps> = ({
  url,
  id,
  index,
  totalQRs,
  size,
}) => {
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const [isDragging, setIsDragging] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstMoveRef = useRef<boolean>(true);
  const [usedPositions, setUsedPositions] = useState<Set<string>>(new Set());
  const touchOffsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (qrRef.current) {
      const left = (e.clientX / window.innerWidth) * 100;
      const top = (e.clientY / window.innerHeight) * 100;

      setPosition({ top: `${top}%`, left: `${left}%` });
      setIsDragging(true);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (qrRef.current) {
      e.stopPropagation();

      const touch = e.touches[0];
      const rect = qrRef.current.getBoundingClientRect();

      touchOffsetRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };

      setIsDragging(true);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const left = (e.clientX / viewportWidth) * 100;
      const top = (e.clientY / viewportHeight) * 100;
      setPosition({ top: `${top}%`, left: `${left}%` });
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && qrRef.current) {
      e.preventDefault();

      const touch = e.touches[0];
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const left =
        ((touch.clientX -
          touchOffsetRef.current.x +
          qrRef.current.clientWidth / 2) /
          viewportWidth) *
        100;
      const top =
        ((touch.clientY -
          touchOffsetRef.current.y +
          qrRef.current.clientHeight / 2) /
          viewportHeight) *
        100;

      setPosition({ top: `${top}%`, left: `${left}%` });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      startAutoMovement();
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      startAutoMovement();
    }
  };

  const moveToRandomPosition = () => {
    if (!isDragging) {
      let newTop = Math.random() * 100;
      let newLeft = Math.random() * 100;

      while (usedPositions.has(`${newTop}-${newLeft}`)) {
        newTop = Math.random() * 100;
        newLeft = Math.random() * 100;
      }

      setPosition({ top: `${newTop}%`, left: `${newLeft}%` });
      setUsedPositions(
        (prevPositions) => new Set(prevPositions.add(`${newTop}-${newLeft}`))
      );
    }
  };

  const startAutoMovement = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isFirstMoveRef.current) {
      setTimeout(() => {
        moveToRandomPosition();
        isFirstMoveRef.current = false;

        intervalRef.current = setInterval(moveToRandomPosition, 8000);
      }, 2000);
    } else {
      intervalRef.current = setInterval(moveToRandomPosition, 8000);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    const touchMoveHandler = (e: TouchEvent) => {
      if (isDragging) {
        handleTouchMove(e);
      }
    };

    window.addEventListener("touchmove", touchMoveHandler, {
      passive: !isDragging,
    });
    window.addEventListener("touchend", handleTouchEnd);

    const initialDelay = index * 100;
    const timer = setTimeout(startAutoMovement, initialDelay);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      window.removeEventListener("touchmove", touchMoveHandler);
      window.removeEventListener("touchend", handleTouchEnd);

      clearTimeout(timer);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      setUsedPositions((prevPositions) => {
        const newPositions = new Set(prevPositions);
        newPositions.delete(`${position.top}-${position.left}`);
        return newPositions;
      });
    };
  }, [index, isDragging, position.top, position.left]);

  return (
    <>
      <style jsx>{pulseStyles}</style>

      <div
        ref={qrRef}
        id={id}
        className={`absolute p-4 bg-white border border-gray-300 rounded-lg shadow-lg ${
          isDragging
            ? "cursor-grabbing shadow-xl z-50 border-2 border-orange-500 animate-pulse"
            : "cursor-grab"
        }`}
        style={{
          top: position.top,
          left: position.left,
          transform: "translate(-50%, -50%)",
          transition: isDragging
            ? "top 0s ease, left 0s ease"
            : "top 8s ease, left 8s ease",
          zIndex: isDragging ? 50 : index,
          animation: isDragging ? "pulse 2s infinite" : "none",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <QRCodeSVG value={url} size={isDragging ? 128 : size} />
      </div>
    </>
  );
};

export default QRGenerator;
