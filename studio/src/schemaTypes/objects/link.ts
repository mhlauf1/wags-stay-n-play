import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'
import type {Link} from '../../../sanity.types'

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          {title: 'URL', value: 'href'},
          {title: 'Page', value: 'page'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      description: 'Absolute URL (https://…) or relative path (/pricing)',
      hidden: ({parent}) => parent?.linkType !== 'href',
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ['http', 'https', 'mailto', 'tel'],
        }).custom((value, context) => {
          const parent = context.parent as Link
          if (parent?.linkType === 'href' && !value) {
            return 'URL is required when Link Type is URL'
          }
          return true
        }),
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: [{type: 'page'}, {type: 'service'}],
      hidden: ({parent}) => parent?.linkType !== 'page',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as Link
          if (parent?.linkType === 'page' && !value) {
            return 'Page reference is required when Link Type is Page'
          }
          return true
        }),
    }),
    defineField({
      name: 'queryString',
      title: 'Query String',
      type: 'string',
      description: 'Optional query params (e.g. ?service=daycare)',
      hidden: ({parent}) => parent?.linkType !== 'page',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
