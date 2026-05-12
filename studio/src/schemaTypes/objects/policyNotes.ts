import {defineField, defineType, defineArrayMember} from 'sanity'
import {InfoOutlineIcon} from '@sanity/icons'

export const policyNotes = defineType({
  name: 'policyNotes',
  title: 'Policy Notes',
  type: 'object',
  icon: InfoOutlineIcon,
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
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'policyCategory',
          title: 'Category',
          fields: [
            defineField({
              name: 'categoryName',
              title: 'Category Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'policies',
              title: 'Policies',
              type: 'array',
              of: [{type: 'string'}],
            }),
          ],
          preview: {
            select: {title: 'categoryName'},
          },
        }),
      ],
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Cream', value: 'cream'},
          {title: 'Sand', value: 'sand'},
          {title: 'Forest', value: 'forest'},
        ],
        layout: 'radio',
      },
      initialValue: 'sand',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Untitled Policy Notes',
        subtitle: 'Policy Notes',
      }
    },
  },
})
