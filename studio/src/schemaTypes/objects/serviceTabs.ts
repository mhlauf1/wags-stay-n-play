import {defineField, defineType} from 'sanity'
import {MasterDetailIcon} from '@sanity/icons'

export const serviceTabs = defineType({
  name: 'serviceTabs',
  title: 'Service Tabs',
  type: 'object',
  icon: MasterDetailIcon,
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
      name: 'tabs',
      title: 'Service Tabs',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'service'}]}],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Service Tabs', subtitle: 'Tabbed Services'}
    },
  },
})
