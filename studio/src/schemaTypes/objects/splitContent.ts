import {defineField, defineType} from 'sanity'
import {SplitHorizontalIcon} from '@sanity/icons'

export const splitContent = defineType({
  name: 'splitContent',
  title: 'Split Content',
  type: 'object',
  icon: SplitHorizontalIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'link', title: 'Link', type: 'link'}),
      ],
    }),
    defineField({
      name: 'badge',
      title: 'Badge Image',
      type: 'image',
      description: 'Optional badge/logo (e.g. Embark logo)',
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
      name: 'image',
      title: 'Image',
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
      name: 'stickerImage',
      title: 'Sticker Image',
      type: 'image',
      description: 'Optional fun illustration/sticker that overlaps the image edge',
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
      name: 'hours',
      title: 'Hours',
      type: 'array',
      description: 'Optional hours block (e.g. for an About section). Renders as a labeled list under the body.',
      of: [
        {
          name: 'hoursEntry',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required()}),
          ],
          preview: {
            select: {title: 'label', subtitle: 'value'},
          },
        },
      ],
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'right',
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
      initialValue: 'sand',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Split Content', subtitle: 'Split Content Section'}
    },
  },
})
