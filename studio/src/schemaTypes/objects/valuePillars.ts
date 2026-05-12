import {defineField, defineType, defineArrayMember} from 'sanity'
import {TrendUpwardIcon} from '@sanity/icons'

export const valuePillars = defineType({
  name: 'valuePillars',
  title: 'Value Pillars',
  type: 'object',
  icon: TrendUpwardIcon,
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
      name: 'pillars',
      title: 'Pillars',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'metric',
              title: 'Metric',
              type: 'string',
              description: 'Large stat or number (e.g. "1:10", "24/7", "7")',
              validation: (Rule) => Rule.required(),
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
            select: {title: 'title', subtitle: 'metric'},
          },
        }),
      ],
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
      initialValue: 4,
    }),
    defineField({
      name: 'accentImage',
      title: 'Accent Image',
      type: 'image',
      description: 'Optional small image (e.g. paw icon) displayed centered below the pillars',
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
      initialValue: 'sand',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Value Pillars',
        subtitle: 'Value Pillars',
      }
    },
  },
})
