import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const AnimatedSVG: Block = {
  slug: 'animatedSvg',
  labels: { singular: 'Animated SVG diagram', plural: 'Animated SVGs' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'preset',
      type: 'select',
      required: true,
      defaultValue: 'dataFlow',
      options: [
        { label: 'Data flow (left → right pipeline)', value: 'dataFlow' },
        { label: 'Pulse rings (concentric pulse)', value: 'pulseRings' },
        { label: 'Network nodes', value: 'network' },
        { label: 'Soundwave bars', value: 'soundwave' },
        { label: 'Path drawing (custom outline)', value: 'pathDrawing' },
      ],
    },
    {
      name: 'speed',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Subtle', value: 'subtle' },
        { label: 'Normal', value: 'normal' },
        { label: 'Energetic', value: 'energetic' },
      ],
    },
    ...sectionBaseFields,
  ],
}
