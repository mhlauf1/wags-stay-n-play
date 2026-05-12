import {defineField, defineType} from 'sanity'
import {SelectIcon} from '@sanity/icons'

export const spacer = defineType({
  name: 'spacer',
  title: 'Spacer',
  type: 'object',
  icon: SelectIcon,
  fields: [
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large', value: 'lg'},
          {title: 'Extra Large', value: 'xl'},
        ],
        layout: 'radio',
      },
      initialValue: 'md',
    }),
  ],
  preview: {
    select: {size: 'size'},
    prepare({size}) {
      return {title: 'Spacer', subtitle: `Size: ${size || 'md'}`}
    },
  },
})
