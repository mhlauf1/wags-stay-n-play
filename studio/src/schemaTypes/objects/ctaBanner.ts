import {defineField, defineType} from 'sanity'
import {RocketIcon} from '@sanity/icons'

export const ctaBanner = defineType({
  name: 'ctaBanner',
  title: 'CTA Banner',
  type: 'object',
  icon: RocketIcon,
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
      name: 'stickerImage',
      title: 'Sticker Image',
      type: 'image',
      description: 'Optional small image displayed in a white circle above the heading',
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
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {hotspot: true},
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
      name: 'sideImage',
      title: 'Side Image',
      type: 'image',
      options: {hotspot: true},
      description:
        'Optional: adds a square photo on the right in a 2-column layout. Leave empty to use the full-width background image mode.',
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
      name: 'cta',
      title: 'CTA Button',
      type: 'button',
    }),
    defineField({
      name: 'alignment',
      title: 'Content Alignment',
      type: 'string',
      description: 'Alignment of the content in the full-width (no side image) layout',
      options: {
        list: [
          {title: 'Center', value: 'center'},
          {title: 'Left', value: 'left'},
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    }),
    defineField({
      name: 'showRating',
      title: 'Show Rating',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'ratingText',
      title: 'Rating Text',
      type: 'string',
      description: 'e.g. "4.4 stars — 100+ reviews on Google"',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'CTA Banner', subtitle: 'Call to Action Banner'}
    },
  },
})
