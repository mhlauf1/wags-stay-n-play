import {defineField, defineType, defineArrayMember} from 'sanity'
import {BlockElementIcon} from '@sanity/icons'

export const featureCards = defineType({
  name: 'featureCards',
  title: 'Feature Cards',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
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
      name: 'stickerLeft',
      title: 'Left Sticker',
      type: 'image',
      description: 'Dog sticker displayed to the left of the heading',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe this image for accessibility',
        }),
      ],
    }),
    defineField({
      name: 'stickerRight',
      title: 'Right Sticker',
      type: 'image',
      description: 'Dog sticker displayed to the right of the heading',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe this image for accessibility',
        }),
      ],
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Iconify icon name (e.g. "mdi:webcam", "mdi:bed")',
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
          ],
          preview: {
            select: {title: 'title', subtitle: 'icon'},
          },
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'CTA Button',
      type: 'button',
    }),
    defineField({
      name: 'trustLine',
      title: 'Trust Line',
      type: 'string',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      description: 'Number of columns on desktop (default: 4)',
      options: {
        list: [
          {title: '3 Columns', value: 3},
          {title: '4 Columns', value: 4},
        ],
        layout: 'radio',
      },
      initialValue: 4,
    }),
    defineField({
      name: 'darkMode',
      title: 'Dark Mode',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Feature Cards', subtitle: 'Feature Cards Section'}
    },
  },
})
