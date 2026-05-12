import {defineField, defineType, defineArrayMember} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'

export const faqAccordion = defineType({
  name: 'faqAccordion',
  title: 'FAQ Accordion',
  type: 'object',
  icon: HelpCircleIcon,
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
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faq',
          title: 'FAQ',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'blockContent',
            }),
          ],
          preview: {
            select: {title: 'question'},
            prepare({title}) {
              return {title: title || 'Untitled FAQ'}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Untitled FAQ Accordion',
        subtitle: 'FAQ Accordion',
      }
    },
  },
})
