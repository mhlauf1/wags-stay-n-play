import {defineField, defineType, defineArrayMember} from 'sanity'
import {CreditCardIcon} from '@sanity/icons'

export const pricingTable = defineType({
  name: 'pricingTable',
  title: 'Pricing Table',
  type: 'object',
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pricingCategory',
          title: 'Category',
          fields: [
            defineField({
              name: 'categoryName',
              title: 'Category Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'tiers',
              title: 'Tiers',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'pricingTier',
                  title: 'Tier',
                  fields: [
                    defineField({
                      name: 'name',
                      title: 'Name',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'price',
                      title: 'Price',
                      type: 'string',
                      description: 'e.g. "$42/day", "Starting at $55"',
                    }),
                    defineField({
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      rows: 2,
                    }),
                    defineField({
                      name: 'features',
                      title: 'Features',
                      type: 'array',
                      of: [{type: 'string'}],
                    }),
                    defineField({
                      name: 'highlighted',
                      title: 'Highlighted',
                      type: 'boolean',
                      initialValue: false,
                    }),
                    defineField({
                      name: 'cta',
                      title: 'CTA Button',
                      type: 'button',
                    }),
                  ],
                  preview: {
                    select: {title: 'name', subtitle: 'price'},
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'categoryName'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Untitled Pricing Table',
        subtitle: 'Pricing Table',
      }
    },
  },
})
