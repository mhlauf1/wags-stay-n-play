import {defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons'

export const heroMinimal = defineType({
  name: 'heroMinimal',
  title: 'Hero Minimal',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Text',
      type: 'string',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'string',
      description: 'e.g. "4.8" — when set, the eyebrow badge becomes a scrolling ticker with stars + rating',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headingAccent',
      title: 'Heading Accent',
      type: 'string',
      description: 'Italic colored second line of the heading',
    }),
    defineField({
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
      rows: 3,
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
      initialValue: 'cream',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Hero Minimal', subtitle: 'Hero Minimal'}
    },
  },
})
