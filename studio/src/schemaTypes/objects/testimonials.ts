import {defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons'

export const testimonials = defineType({
  name: 'testimonials',
  title: 'Testimonials',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      description: 'Optional icon/illustration displayed above the heading',
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
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reviews',
      title: 'Reviews',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'testimonial'}]}],
    }),
    defineField({
      name: 'googleRating',
      title: 'Google Rating',
      type: 'string',
      description: 'e.g. "4.4"',
    }),
    defineField({
      name: 'googleReviewCount',
      title: 'Google Review Count',
      type: 'number',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Testimonials', subtitle: 'Reviews Section'}
    },
  },
})
