import {defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

export const photoMarquee = defineType({
  name: 'photoMarquee',
  title: 'Photo Marquee',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'marqueeImages',
      title: 'Marquee Images',
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
      options: {layout: 'grid'},
      validation: (Rule) => Rule.min(3),
    }),
  ],
  preview: {
    select: {title: 'marqueeImages'},
    prepare({title}) {
      const count = title?.length || 0
      return {title: `Photo Marquee (${count} images)`, subtitle: 'Photo Marquee'}
    },
  },
})
