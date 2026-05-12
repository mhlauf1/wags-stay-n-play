import {defineField, defineType} from 'sanity'
import {ActivityIcon} from '@sanity/icons'

export const pricingCalculator = defineType({
  name: 'pricingCalculator',
  title: 'Pricing Calculator',
  type: 'object',
  icon: ActivityIcon,
  fields: [
    defineField({
      name: 'displayMode',
      title: 'Display Mode',
      type: 'string',
      options: {
        list: [
          {title: 'Single Calculator', value: 'single'},
          {title: 'Tabbed (All Services)', value: 'tabbed'},
        ],
        layout: 'radio',
      },
      initialValue: 'single',
    }),
    defineField({
      name: 'calculatorType',
      title: 'Calculator Type',
      type: 'string',
      options: {
        list: [
          {title: 'Daycare', value: 'daycare'},
          {title: 'Boarding', value: 'boarding'},
          {title: 'Grooming', value: 'grooming'},
        ],
        layout: 'radio',
      },
      hidden: ({parent}) => parent?.displayMode === 'tabbed',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {displayMode?: string}
          if (parent?.displayMode === 'tabbed') return true
          return value ? true : 'Calculator type is required for single mode'
        }),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Pricing Calculator',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Book Now',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'link',
    }),
    defineField({
      name: 'taxNote',
      title: 'Tax Note',
      type: 'string',
      initialValue: 'Prices shown before applicable tax',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      calculatorType: 'calculatorType',
      displayMode: 'displayMode',
    },
    prepare({title, calculatorType, displayMode}) {
      const mode = displayMode === 'tabbed' ? 'Tabbed (All Services)' : calculatorType ? `${calculatorType.charAt(0).toUpperCase()}${calculatorType.slice(1)} Calculator` : 'No type selected'
      return {
        title: title || 'Pricing Calculator',
        subtitle: mode,
      }
    },
  },
})
