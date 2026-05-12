import {defineField, defineType, defineArrayMember} from 'sanity'
import {MenuIcon} from '@sanity/icons'

export const pricingList = defineType({
  name: 'pricingList',
  title: 'Pricing List',
  type: 'object',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
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
          name: 'pricingListItem',
          title: 'Item',
          fields: [
            defineField({
              name: 'service',
              title: 'Service',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'string',
              description: 'e.g. "$17", "$1/min"',
            }),
            defineField({
              name: 'note',
              title: 'Note',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'service', subtitle: 'price'},
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
          {title: '1 Column', value: 1},
          {title: '2 Columns', value: 2},
        ],
        layout: 'radio',
      },
      initialValue: 1,
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
      return {
        title: title || 'Untitled Pricing List',
        subtitle: 'Pricing List',
      }
    },
  },
})
