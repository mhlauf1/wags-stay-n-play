import {defineField, defineType} from 'sanity'
import {BoltIcon} from '@sanity/icons'

export const ctaStrip = defineType({
  name: 'ctaStrip',
  title: 'CTA Strip',
  type: 'object',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtext',
      title: 'Subtext',
      type: 'string',
    }),
    defineField({
      name: 'cta',
      title: 'CTA Button',
      type: 'button',
      validation: (Rule) => Rule.required(),
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
          {title: 'Terracotta', value: 'terracotta'},
        ],
        layout: 'radio',
      },
      initialValue: 'forest',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'CTA Strip', subtitle: 'CTA Strip Section'}
    },
  },
})
