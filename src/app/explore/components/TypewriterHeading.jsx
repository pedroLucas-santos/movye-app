"use client"

import { useEffect, useState } from "react"

export default function TypewriterHeading({
  text = "EXPLORAR",
  className = "text-7xl mb-2 tracking-wider",
  typingSpeed = 150,
  startDelay = 500,
  cursorBlinkSpeed = 500,
  loop = true,
  loopDelay = 2000,
}) {
  const [displayText, setDisplayText] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Initial delay before starting
    const startTimer = setTimeout(() => {
      setIsTyping(true)
    }, startDelay)

    return () => clearTimeout(startTimer)
  }, [startDelay])

  useEffect(() => {
    // Cursor blinking effect
    const cursorTimer = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, cursorBlinkSpeed)

    return () => clearInterval(cursorTimer)
  }, [cursorBlinkSpeed])

  useEffect(() => {
    if (!isTyping) return

    let timer

    if (!isDeleting && displayText.length < text.length) {
      // Typing forward
      timer = setTimeout(() => {
        setDisplayText(text.substring(0, displayText.length + 1))
      }, typingSpeed)
    } else if (!isDeleting && displayText.length === text.length && loop) {
      // Pause at the end before deleting
      timer = setTimeout(() => {
        setIsDeleting(true)
      }, loopDelay)
    } else if (isDeleting && displayText.length > 0) {
      // Deleting
      timer = setTimeout(() => {
        setDisplayText(text.substring(0, displayText.length - 1))
      }, typingSpeed / 1.5) // Deleting is a bit faster
    } else if (isDeleting && displayText.length === 0) {
      // Start typing again after complete deletion
      timer = setTimeout(() => {
        setIsDeleting(false)
      }, startDelay)
    }

    return () => clearTimeout(timer)
  }, [displayText, isTyping, isDeleting, text, typingSpeed, loop, loopDelay, startDelay])

  return (
    <h1 className={className}>
      <span>{displayText}</span>
      <span
        className={`inline-block w-[0.08em] h-[1.1em] bg-current ml-1 -mb-[0.1em] ${
          cursorVisible ? "opacity-100" : "opacity-0"
        } transition-opacity duration-100`}
        aria-hidden="true"
      />
    </h1>
  )
}

