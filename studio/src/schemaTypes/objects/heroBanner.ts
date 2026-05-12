import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const heroBanner = defineType({
  name: 'heroBanner',
  title: 'Hero Banner',
  type: 'object',
  icon: ImageIcon,
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
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Overlay Opacity',
      type: 'string',
      options: {
        list: [
          {title: 'Light', value: 'light'},
          {title: 'Medium', value: 'medium'},
          {title: 'Heavy', value: 'heavy'},
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'minHeight',
      title: 'Minimum Height',
      type: 'string',
      options: {
        list: [
          {title: 'Standard', value: 'standard'},
          {title: 'Tall', value: 'tall'},
          {title: 'Fullscreen', value: 'fullscreen'},
        ],
        layout: 'radio',
      },
      initialValue: 'standard',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Used when no background image is set',
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
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Hero Banner', subtitle: 'Hero Banner Section'}
    },
  },
})
