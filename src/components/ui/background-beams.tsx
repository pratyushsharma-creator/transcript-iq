'use client'

/**
 * Adapted from Aceternity UI BackgroundBeams (MIT).
 * Subtle animated SVG paths that fade in and out, used as ambient background.
 * Tuned for our mint accent (#0ed98a) and dark surface.
 */

import { motion } from 'motion/react'
import { useId } from 'react'

const PATHS = [
  'M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875',
  'M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867',
  'M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859',
  'M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851',
  'M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843',
  'M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835',
  'M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827',
  'M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819',
]

export function BackgroundBeams({ className }: { className?: string }) {
  const id = useId()
  return (
    <div
      className={
        'pointer-events-none absolute inset-0 z-0 flex h-full w-full items-center justify-center [mask-image:radial-gradient(60%_50%_at_50%_50%,black_0%,transparent_100%)] ' +
        (className ?? '')
      }
    >
      <svg
        className="pointer-events-none absolute z-0 h-full w-full"
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {PATHS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke={`url(#${id}-gradient-${i})`}
            strokeOpacity="0.4"
            strokeWidth="0.5"
          />
        ))}
        <defs>
          {PATHS.map((_, i) => (
            <motion.linearGradient
              key={i}
              id={`${id}-gradient-${i}`}
              initial={{
                x1: '0%',
                x2: '0%',
                y1: '0%',
                y2: '0%',
              }}
              animate={{
                x1: ['0%', '100%'],
                x2: ['0%', '95%'],
                y1: ['0%', '100%'],
                y2: ['0%', `${93 + i}%`],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                ease: 'easeInOut',
                repeat: Infinity,
                delay: Math.random() * 10,
              }}
            >
              <stop stopColor="#0ed98a" stopOpacity="0" />
              <stop stopColor="#0ed98a" />
              <stop offset="32.5%" stopColor="#3eef9f" />
              <stop offset="100%" stopColor="#0ed98a" stopOpacity="0" />
            </motion.linearGradient>
          ))}
        </defs>
      </svg>
    </div>
  )
}
