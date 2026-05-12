import {defineField, defineType, defineArrayMember} from 'sanity'
import {ThLargeIcon} from '@sanity/icons'

export const pricingMatrix = defineType({
  name: 'pricingMatrix',
  title: 'Pricing Matrix',
  type: 'object',
  icon: ThLargeIcon,
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
      name: 'tables',
      title: 'Tables',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'matrixTable',
          title: 'Table',
          fields: [
            defineField({
              name: 'tableName',
              title: 'Table Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'tableDescription',
              title: 'Table Description',
              type: 'string',
            }),
            defineField({
              name: 'columnHeaders',
              title: 'Column Headers',
              type: 'array',
              of: [{type: 'string'}],
            }),
            defineField({
              name: 'rows',
              title: 'Rows',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'matrixRow',
                  title: 'Row',
                  fields: [
                    defineField({
                      name: 'rowLabel',
                      title: 'Row Label',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'cells',
                      title: 'Cells',
                      type: 'array',
                      of: [
                        defineArrayMember({
                          type: 'object',
                          name: 'matrixCell',
                          title: 'Cell',
                          fields: [
                            defineField({
                              name: 'value',
                              title: 'Value',
                              type: 'string',
                            }),
                            defineField({
                              name: 'note',
                              title: 'Note',
                              type: 'string',
                            }),
                          ],
                          preview: {
                            select: {title: 'value', subtitle: 'note'},
                          },
                        }),
                      ],
                    }),
                  ],
                  preview: {
                    select: {title: 'rowLabel'},
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'tableName', subtitle: 'tableDescription'},
          },
        }),
      ],
    }),
    defineField({
      name: 'footnotes',
      title: 'Footnotes',
      type: 'array',
      of: [{type: 'string'}],
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
        title: title || 'Untitled Pricing Matrix',
        subtitle: 'Pricing Matrix',
      }
    },
  },
})
