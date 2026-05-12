import {defineField, defineType, defineArrayMember} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

export const galleryPage = defineType({
  name: 'galleryPage',
  title: 'Gallery Page',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'span',
              title: 'Column Span',
              type: 'number',
              options: {
                list: [
                  {title: '1 Column', value: 1},
                  {title: '2 Columns (Wide)', value: 2},
                ],
                layout: 'radio',
              },
              initialValue: 1,
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Grid', value: 'grid'},
          {title: 'Single Column', value: 'single'},
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
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
        title: title || 'Gallery Page',
        subtitle: 'Gallery Page',
      }
    },
  },
})
