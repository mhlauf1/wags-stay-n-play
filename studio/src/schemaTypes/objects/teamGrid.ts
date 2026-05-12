import {defineField, defineType, defineArrayMember} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const teamGrid = defineType({
  name: 'teamGrid',
  title: 'Team Grid',
  type: 'object',
  icon: UsersIcon,
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
      name: 'members',
      title: 'Team Members',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'teamMember',
          title: 'Team Member',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
            }),
            defineField({
              name: 'bio',
              title: 'Bio',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'certifications',
              title: 'Certifications',
              type: 'string',
              description: 'e.g. "CPDT-KA, Pet First Aid Certified"',
            }),
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'image',
              options: {hotspot: true},
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'role', media: 'image'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Untitled Team Grid',
        subtitle: 'Team Grid',
      }
    },
  },
})
