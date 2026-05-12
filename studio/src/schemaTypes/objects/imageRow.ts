import {defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

export const imageRow = defineType({
  name: 'imageRow',
  title: 'Image Row',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),
  ],
  preview: {
    select: {images: 'images'},
    prepare({images}) {
      return {
        title: `Image Row (${images?.length || 0} images)`,
        subtitle: 'Photo Strip',
      }
    },
  },
})
