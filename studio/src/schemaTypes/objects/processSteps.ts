import {defineField, defineType, defineArrayMember} from 'sanity'
import {NumberIcon} from '@sanity/icons'

export const processSteps = defineType({
  name: 'processSteps',
  title: 'Process Steps',
  type: 'object',
  icon: NumberIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Text',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'step',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'badge',
              title: 'Badge Text',
              type: 'string',
              description: 'Optional label shown below the title (e.g. "6:30 AM - 12:00 PM", "All Day")',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Iconify icon name (e.g. "mdi:calendar-check", "mdi:dog")',
            }),
          ],
          preview: {
            select: {title: 'title'},
          },
        }),
      ],
      validation: (Rule) => Rule.min(2).max(6),
    }),
    defineField({
      name: 'cta',
      title: 'CTA Button',
      type: 'button',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Cream', value: 'cream'},
          {title: 'Sand', value: 'sand'},
          {title: 'Forest', value: 'forest'},
        ],
        layout: 'radio',
      },
      initialValue: 'cream',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Process Steps', subtitle: 'Process Steps Section'}
    },
  },
})
