import {defineField, defineType, defineArrayMember} from 'sanity'
import {InlineIcon} from '@sanity/icons'

export const whatsIncluded = defineType({
  name: 'whatsIncluded',
  title: "What's Included",
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
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Iconify icon name (e.g. "mdi:bed-outline", "mdi:paw")',
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
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Card', value: 'card'},
          {title: 'Inline', value: 'inline'},
        ],
        layout: 'radio',
      },
      initialValue: 'card',
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
        layout: 'radio',
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
          {title: 'Forest', value: 'forest'},
        ],
        layout: 'radio',
      },
      initialValue: 'cream',
    }),
    defineField({
      name: 'iconColor',
      title: 'Icon Color Scheme',
      type: 'string',
      options: {
        list: [
          {title: 'Terracotta', value: 'terracotta'},
          {title: 'Forest', value: 'forest'},
          {title: 'Muted', value: 'muted'},
        ],
        layout: 'radio',
      },
      initialValue: 'terracotta',
    }),
  ],
  preview: {
    select: {title: 'heading', layout: 'layout'},
    prepare({title, layout}) {
      return {
        title: title || "What's Included",
        subtitle: `What's Included — ${layout === 'inline' ? 'Inline' : 'Card'} layout`,
      }
    },
  },
})
