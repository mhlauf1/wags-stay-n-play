import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: HomeIcon,
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
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'button',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'button',
    }),
    defineField({
      name: 'reviewRating',
      title: 'Review Star Rating',
      type: 'number',
      description: 'Number of filled stars (1–5)',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'reviewText',
      title: 'Review Text',
      type: 'string',
      description: 'e.g. "200+ 5 Star Reviews"',
    }),
    defineField({
      name: 'trustLine',
      title: 'Trust Line',
      type: 'string',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'carouselImages',
      title: 'Carousel Images',
      type: 'array',
      description:
        'Optional row of facility photos that scrolls horizontally beneath the hero copy. Recommend 5–8 images.',
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
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Hero', subtitle: 'Hero Section'}
    },
  },
})
