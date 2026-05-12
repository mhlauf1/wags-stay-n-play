import {defineField, defineType, defineArrayMember} from 'sanity'
import {InlineIcon} from '@sanity/icons'

export const contentColumns = defineType({
  name: 'contentColumns',
  title: 'Content Columns',
  type: 'object',
  icon: InlineIcon,
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
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'blockContent',
            }),
            defineField({
              name: 'cta',
              title: 'CTA Button',
              type: 'button',
            }),
          ],
          preview: {
            select: {title: 'heading'},
          },
        }),
      ],
      validation: (Rule) => Rule.min(2).max(3),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'number',
      options: {
        list: [
          {title: '2 Columns', value: 2},
          {title: '3 Columns', value: 3},
        ],
      },
      initialValue: 2,
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Cream', value: 'cream'},
          {title: 'Sand', value: 'sand'},
        ],
        layout: 'radio',
      },
      initialValue: 'cream',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Content Columns', subtitle: 'Content Columns Section'}
    },
  },
})
