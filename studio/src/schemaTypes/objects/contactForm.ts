import {defineField, defineType, defineArrayMember} from 'sanity'
import {EnvelopeIcon, ImageIcon} from '@sanity/icons'

export const contactForm = defineType({
  name: 'contactForm',
  title: 'Contact Form',
  type: 'object',
  icon: EnvelopeIcon,
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
      type: 'blockContent',
    }),
    defineField({
      name: 'formFields',
      title: 'Form Fields',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'formField',
          title: 'Form Field',
          fields: [
            defineField({
              name: 'fieldName',
              title: 'Field Name',
              type: 'string',
              description: 'Internal field identifier (e.g. "email", "message")',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'type',
              title: 'Field Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Text', value: 'text'},
                  {title: 'Email', value: 'email'},
                  {title: 'Phone', value: 'tel'},
                  {title: 'Textarea', value: 'textarea'},
                  {title: 'Select', value: 'select'},
                ],
              },
              initialValue: 'text',
            }),
            defineField({
              name: 'required',
              title: 'Required',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'options',
              title: 'Options',
              type: 'array',
              of: [{type: 'string'}],
              description: 'Only used for "Select" field type',
              hidden: ({parent}) => parent?.type !== 'select',
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'type'},
          },
        }),
      ],
    }),
    defineField({
      name: 'submitButtonText',
      title: 'Submit Button Text',
      type: 'string',
      initialValue: 'Send Message',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'string',
      initialValue: 'Thank you! We\'ll be in touch soon.',
    }),
    defineField({
      name: 'showMap',
      title: 'Show Map',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Map Embed URL',
      type: 'url',
      hidden: ({parent}) => !parent?.showMap,
    }),
    defineField({
      name: 'nextSteps',
      title: 'Next Steps',
      type: 'array',
      description: 'Show numbered steps below the form to set expectations',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'nextStep',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'description'},
          },
        }),
      ],
    }),
    defineField({
      name: 'image',
      title: 'Sidebar Image',
      type: 'image',
      description: 'Photo displayed above the contact info on the right side',
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
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'hours',
      title: 'Hours of Operation',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'hoursEntry',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'value'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Untitled Contact Form',
        subtitle: 'Contact Form',
      }
    },
  },
})
