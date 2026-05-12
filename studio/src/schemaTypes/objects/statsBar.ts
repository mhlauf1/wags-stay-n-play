import {defineField, defineType, defineArrayMember} from 'sanity'
import {BarChartIcon} from '@sanity/icons'

export const statsBar = defineType({
  name: 'statsBar',
  title: 'Stats Bar',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'statItem',
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'e.g. "12+", "4.4 ★", "1,000+"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'value', subtitle: 'label'},
          },
        }),
      ],
    }),
    defineField({
      name: 'showLogo',
      title: 'Show Logo',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Stats Bar', subtitle: 'Statistics Section'}
    },
  },
})
