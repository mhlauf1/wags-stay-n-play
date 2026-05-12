import {defineField, defineType, defineArrayMember} from 'sanity'
import {BlockElementIcon} from '@sanity/icons'

export const expandingCardsRow = defineType({
  name: 'expandingCardsRow',
  title: 'Expanding Cards Row',
  type: 'object',
  icon: BlockElementIcon,
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
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      validation: (Rule) => Rule.min(2).max(4),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Background Image',
              type: 'image',
              options: {hotspot: true},
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'subtext',
              title: 'Subtext',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'link',
              title: 'Learn More Link',
              type: 'button',
            }),
          ],
          preview: {
            select: {title: 'title', media: 'image'},
          },
        }),
      ],
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
      return {title: title || 'Expanding Cards Row', subtitle: 'Expanding Cards Row Section'}
    },
  },
})
