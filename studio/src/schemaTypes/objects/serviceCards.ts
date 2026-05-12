import {defineField, defineType, defineArrayMember} from 'sanity'
import {InlineElementIcon} from '@sanity/icons'

export const serviceCards = defineType({
  name: 'serviceCards',
  title: 'Service Cards',
  type: 'object',
  icon: InlineElementIcon,
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
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'serviceCard',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'title',
              title: 'Title',
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
              name: 'cta',
              title: 'CTA Button',
              type: 'button',
            }),
          ],
          preview: {
            select: {title: 'title'},
          },
        }),
      ],
    }),
    defineField({
      name: 'variant',
      title: 'Card Style',
      type: 'string',
      options: {
        list: [
          {title: 'White card with image on top', value: 'white'},
          {title: 'Image background with overlay text + numbered badge', value: 'imageOverlay'},
        ],
        layout: 'radio',
      },
      initialValue: 'white',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {
        list: [
          {title: '2 Columns', value: 2},
          {title: '3 Columns', value: 3},
          {title: '4 Columns', value: 4},
        ],
      },
      initialValue: 3,
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
      return {title: title || 'Service Cards', subtitle: 'Service Cards Section'}
    },
  },
})
