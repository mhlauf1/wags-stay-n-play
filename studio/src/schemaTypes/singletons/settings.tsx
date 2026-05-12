import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import type {Link, Settings} from '../../../sanity.types'

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      description: 'Site title',
      title: 'Title',
      type: 'string',
      initialValue: 'Kingdom Canine',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short tagline used in site branding',
    }),
    defineField({
      name: 'description',
      description: 'Used for SEO meta description',
      title: 'Description',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          options: {},
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'linkType',
                    title: 'Link Type',
                    type: 'string',
                    initialValue: 'href',
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
                    hidden: ({parent}) => parent?.linkType !== 'href' && parent?.linkType != null,
                    validation: (Rule) =>
                      Rule.custom((value, context) => {
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
                    to: [{type: 'page'}],
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
                    name: 'openInNewTab',
                    title: 'Open in new tab',
                    type: 'boolean',
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Site logo image',
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
      name: 'navItems',
      title: 'Navigation Items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'navItem',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'link',
              description: 'Leave empty if this item has dropdown children',
              hidden: ({parent}) =>
                Array.isArray(parent?.children) && parent.children.length > 0,
            }),
            defineField({
              name: 'children',
              title: 'Dropdown Items',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({name: 'label', title: 'Label', type: 'string'}),
                    defineField({name: 'link', title: 'Link', type: 'link'}),
                  ],
                  preview: {select: {title: 'label'}},
                }),
              ],
            }),
          ],
          preview: {select: {title: 'label'}},
        }),
      ],
    }),
    defineField({
      name: 'ctaButton',
      title: 'Header CTA Button',
      type: 'button',
    }),
    defineField({
      name: 'footerSticker',
      title: 'Footer Sticker',
      type: 'image',
      description: 'Small dog illustration shown at the bottom of the brand column in the footer',
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
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer Columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Column Title', type: 'string'}),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({name: 'label', title: 'Label', type: 'string'}),
                    defineField({name: 'link', title: 'Link', type: 'link'}),
                  ],
                  preview: {select: {title: 'label'}},
                }),
              ],
            }),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({name: 'address', title: 'Address', type: 'text', rows: 2}),
        defineField({name: 'phone', title: 'Phone', type: 'string'}),
        defineField({name: 'email', title: 'Email', type: 'string'}),
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Copyright Text',
      type: 'string',
      description: 'e.g. "© 2026 Kingdom Canine. Part of the Embark Pet Services family."',
    }),
    defineField({
      name: 'footerTextLink',
      title: 'Footer Copyright Link',
      type: 'object',
      description: 'Optional link embedded in the copyright text (e.g. "Embark Pet Services")',
      fields: [
        defineField({name: 'label', title: 'Link Text', type: 'string'}),
        defineField({name: 'href', title: 'URL', type: 'url'}),
      ],
    }),
    defineField({
      name: 'footerBottomLinks',
      title: 'Footer Bottom Links',
      type: 'array',
      description: 'Legal links like Privacy Policy, Terms of Service',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'link', title: 'Link', type: 'link'}),
          ],
          preview: {select: {title: 'label'}},
        }),
      ],
    }),
    defineField({
      name: 'yearEstablished',
      title: 'Year Established',
      type: 'number',
      description: 'e.g. 2012 — used for trust signals',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({name: 'facebook', title: 'Facebook URL', type: 'url'}),
        defineField({name: 'instagram', title: 'Instagram URL', type: 'url'}),
        defineField({name: 'google', title: 'Google Business URL', type: 'url'}),
      ],
    }),
    defineField({
      name: 'posUrls',
      title: 'POS & Booking URLs',
      type: 'object',
      description: 'External POS system URLs. Update these when swapping providers (Gingr → Goose).',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'portalUrl', title: 'Customer Portal URL', type: 'url', description: 'Main customer portal / booking page'}),
        defineField({name: 'registrationUrl', title: 'New Customer Registration URL', type: 'url'}),
        defineField({name: 'daycareBookingUrl', title: 'Daycare Booking URL', type: 'url'}),
        defineField({name: 'boardingBookingUrl', title: 'Boarding Booking URL', type: 'url'}),
        defineField({name: 'groomingBookingUrl', title: 'Grooming Booking URL', type: 'url'}),
        defineField({name: 'transportationBookingUrl', title: 'Transportation Booking URL', type: 'url'}),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        defineField({
          name: 'alt',
          description: 'Important for accessibility and SEO.',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              const document = context.document as Settings
              if (document?.ogImage?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        }),
        defineField({
          name: 'metadataBase',
          type: 'url',
          description: (
            <a
              href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase"
              rel="noreferrer noopener"
            >
              More information
            </a>
          ),
        }),
      ],
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Site favicon (recommended: 512x512 PNG)',
    }),
    defineField({
      name: 'ga4MeasurementId',
      title: 'GA4 Measurement ID',
      type: 'string',
      description: 'Google Analytics 4 Measurement ID (e.g. G-XXXXXXXXXX)',
      validation: (Rule) =>
        Rule.warning().custom((value) => {
          if (value && !/^G-[A-Z0-9]+$/.test(value)) {
            return 'Should match format G-XXXXXXXXXX'
          }
          return true
        }),
    }),
    defineField({
      name: 'gtmContainerId',
      title: 'GTM Container ID',
      type: 'string',
      description: 'Google Tag Manager Container ID (e.g. GTM-XXXXXXX)',
      validation: (Rule) =>
        Rule.warning().custom((value) => {
          if (value && !/^GTM-[A-Z0-9]+$/.test(value)) {
            return 'Should match format GTM-XXXXXXX'
          }
          return true
        }),
    }),
    defineField({
      name: 'googleSiteVerification',
      title: 'Google Site Verification',
      type: 'string',
      description: 'Google Search Console verification meta tag content',
    }),
    defineField({
      name: 'localBusiness',
      title: 'Local Business (Structured Data)',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'businessName', title: 'Business Name', type: 'string'}),
        defineField({
          name: 'businessType',
          title: 'Business Type',
          type: 'string',
          description: 'Schema.org type (e.g. LocalBusiness, Kennel, PetStore)',
          initialValue: 'LocalBusiness',
        }),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'object',
          fields: [
            defineField({name: 'street', title: 'Street', type: 'string'}),
            defineField({name: 'city', title: 'City', type: 'string'}),
            defineField({name: 'state', title: 'State', type: 'string'}),
            defineField({name: 'zip', title: 'ZIP', type: 'string'}),
            defineField({name: 'country', title: 'Country', type: 'string', initialValue: 'US'}),
          ],
        }),
        defineField({name: 'phone', title: 'Phone', type: 'string'}),
        defineField({
          name: 'geoCoordinates',
          title: 'Geo Coordinates',
          type: 'object',
          fields: [
            defineField({name: 'latitude', title: 'Latitude', type: 'number'}),
            defineField({name: 'longitude', title: 'Longitude', type: 'number'}),
          ],
        }),
        defineField({
          name: 'businessHours',
          title: 'Business Hours',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'days',
                  title: 'Days',
                  type: 'string',
                  description: 'e.g. Mo-Fr, Sa, Su',
                }),
                defineField({name: 'open', title: 'Open', type: 'string', description: 'e.g. 06:00'}),
                defineField({name: 'close', title: 'Close', type: 'string', description: 'e.g. 19:00'}),
              ],
              preview: {
                select: {days: 'days', open: 'open', close: 'close'},
                prepare({days, open, close}) {
                  return {title: `${days}: ${open} – ${close}`}
                },
              },
            }),
          ],
        }),
        defineField({
          name: 'priceRange',
          title: 'Price Range',
          type: 'string',
          description: 'e.g. $$',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})
