import {defineField, defineType, defineArrayMember} from 'sanity'
import {CreditCardIcon} from '@sanity/icons'

export const pricingPageTabs = defineType({
  name: 'pricingPageTabs',
  title: 'Pricing Page Tabs',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'defaultTab',
      title: 'Default Tab',
      type: 'string',
      options: {
        list: [
          {title: 'Daycare', value: 'daycare'},
          {title: 'Boarding', value: 'boarding'},
          {title: 'Grooming', value: 'grooming'},
        ],
        layout: 'radio',
      },
      initialValue: 'daycare',
    }),
    defineField({
      name: 'services',
      title: 'Service Tabs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'serviceKey',
              title: 'Service',
              type: 'string',
              options: {
                list: [
                  {title: 'Daycare', value: 'daycare'},
                  {title: 'Boarding', value: 'boarding'},
                  {title: 'Grooming', value: 'grooming'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'pricingDisplay',
              title: 'Pricing Display Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Tier Cards (Daycare/Boarding)', value: 'table'},
                  {title: 'Matrix Grid (Grooming)', value: 'matrix'},
                ],
                layout: 'radio',
              },
              initialValue: 'table',
            }),
            defineField({
              name: 'tableData',
              title: 'Tier Card Data',
              type: 'object',
              hidden: ({parent}) => parent?.pricingDisplay !== 'table',
              fields: [
                defineField({
                  name: 'categories',
                  title: 'Categories',
                  type: 'array',
                  of: [
                    defineArrayMember({
                      type: 'object',
                      name: 'pricingCategory',
                      fields: [
                        defineField({name: 'categoryName', title: 'Category Name', type: 'string'}),
                        defineField({
                          name: 'tiers',
                          title: 'Tiers',
                          type: 'array',
                          of: [
                            defineArrayMember({
                              type: 'object',
                              name: 'pricingTier',
                              fields: [
                                defineField({name: 'name', title: 'Name', type: 'string'}),
                                defineField({name: 'price', title: 'Price', type: 'string'}),
                                defineField({name: 'description', title: 'Description', type: 'string'}),
                                defineField({
                                  name: 'features',
                                  title: 'Features',
                                  type: 'array',
                                  of: [{type: 'string'}],
                                }),
                                defineField({name: 'highlighted', title: 'Highlighted', type: 'boolean'}),
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
                defineField({
                  name: 'description',
                  title: 'Section Description',
                  type: 'text',
                  rows: 2,
                }),
              ],
            }),
            defineField({
              name: 'matrixData',
              title: 'Matrix Grid Data',
              type: 'object',
              hidden: ({parent}) => parent?.pricingDisplay !== 'matrix',
              fields: [
                defineField({
                  name: 'description',
                  title: 'Section Description',
                  type: 'text',
                  rows: 2,
                }),
                defineField({
                  name: 'tables',
                  title: 'Tables',
                  type: 'array',
                  of: [
                    defineArrayMember({
                      type: 'object',
                      name: 'matrixTable',
                      fields: [
                        defineField({name: 'tableName', title: 'Table Name', type: 'string'}),
                        defineField({name: 'tableDescription', title: 'Description', type: 'string'}),
                        defineField({
                          name: 'columnHeaders',
                          title: 'Column Headers',
                          type: 'array',
                          of: [{type: 'string'}],
                        }),
                        defineField({
                          name: 'rows',
                          title: 'Rows',
                          type: 'array',
                          of: [
                            defineArrayMember({
                              type: 'object',
                              name: 'matrixRow',
                              fields: [
                                defineField({name: 'rowLabel', title: 'Row Label', type: 'string'}),
                                defineField({
                                  name: 'cells',
                                  title: 'Cells',
                                  type: 'array',
                                  of: [
                                    defineArrayMember({
                                      type: 'object',
                                      name: 'matrixCell',
                                      fields: [
                                        defineField({name: 'value', title: 'Value', type: 'string'}),
                                        defineField({name: 'note', title: 'Note', type: 'string'}),
                                      ],
                                      preview: {select: {title: 'value'}},
                                    }),
                                  ],
                                }),
                              ],
                              preview: {select: {title: 'rowLabel'}},
                            }),
                          ],
                        }),
                      ],
                      preview: {select: {title: 'tableName'}},
                    }),
                  ],
                }),
                defineField({
                  name: 'footnotes',
                  title: 'Footnotes',
                  type: 'array',
                  of: [{type: 'string'}],
                }),
              ],
            }),
            defineField({
              name: 'showCalculator',
              title: 'Show Calculator',
              type: 'boolean',
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              serviceKey: 'serviceKey',
              pricingDisplay: 'pricingDisplay',
            },
            prepare({serviceKey, pricingDisplay}) {
              const label = serviceKey
                ? serviceKey.charAt(0).toUpperCase() + serviceKey.slice(1)
                : 'Unknown'
              return {
                title: `${label} Tab`,
                subtitle: pricingDisplay === 'matrix' ? 'Matrix Grid' : 'Tier Cards',
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'ctaText',
      title: 'Calculator CTA Text',
      type: 'string',
      initialValue: 'Book Now',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Calculator CTA Link',
      type: 'link',
    }),
    defineField({
      name: 'taxNote',
      title: 'Tax Note',
      type: 'string',
      initialValue: 'Prices shown before applicable tax and credit card surcharge',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Pricing Page Tabs',
        subtitle: 'Tabbed pricing with calculator',
      }
    },
  },
})
