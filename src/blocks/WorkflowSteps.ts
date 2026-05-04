import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const WorkflowSteps: Block = {
  slug: 'workflowSteps',
  labels: { singular: 'Workflow steps', plural: 'Workflow steps blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'steps',
      type: 'array',
      minRows: 2,
      maxRows: 8,
      fields: [
        {
          name: 'stepNumber',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "Step 01"' },
        },
        { name: 'title', type: 'text', required: true },
        {
          name: 'subtitle',
          type: 'text',
          admin: { description: 'Short subtitle shown on the tab button' },
        },
        { name: 'panelHeading', type: 'text' },
        { name: 'panelBody', type: 'textarea' },
        {
          name: 'tipsLabel',
          type: 'text',
          admin: { description: 'Label above the checklist box (e.g. "What you receive")' },
        },
        {
          name: 'tips',
          type: 'array',
          fields: [{ name: 'tip', type: 'text', required: true }],
        },
      ],
    },
    ...sectionBaseFields,
  ],
}
