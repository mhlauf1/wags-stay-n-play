#!/usr/bin/env node
/**
 * One-shot migration: move the settings singleton from its auto-generated UUID
 * (0f056e49-7b45-4c84-84e6-f7ddf3abb654) to the fixed ID "siteSettings" that
 * studio/src/structure/index.ts expects. Without this, the Studio's
 * "Site Settings" sidebar entry opens an empty new doc while the real content
 * (logo, nav, footer, etc.) is orphaned at the UUID.
 *
 * Safe because:
 *   1. No other document references the old UUID (verified via GROQ references()).
 *   2. The frontend queries settings by _type == 'settings', not by ID.
 *
 * Reads the Sanity auth token from the CLI session (`sanity debug --secrets`).
 * Usage:  node scripts/migrate-settings-id.js
 */

const {execSync} = require('node:child_process')
const {createClient} = require('@sanity/client')

const OLD_ID = '0f056e49-7b45-4c84-84e6-f7ddf3abb654'
const NEW_ID = 'siteSettings'

function getCliToken() {
  const out = execSync('sanity debug --secrets', {encoding: 'utf8'})
  const m = out.match(/Auth token:\s*'([^']+)'/)
  if (!m) throw new Error('Could not read CLI auth token. Run `sanity login` first.')
  return m[1]
}

async function main() {
  const client = createClient({
    projectId: 'dafhmkyq',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token: getCliToken(),
    useCdn: false,
  })

  const oldPublished = await client.getDocument(OLD_ID)
  if (!oldPublished) {
    console.error(`No published doc at ${OLD_ID}. Aborting.`)
    process.exit(1)
  }
  const oldDraft = await client.getDocument(`drafts.${OLD_ID}`).catch(() => null)

  const existing = await client.getDocument(NEW_ID)
  if (existing) {
    console.error(`A doc already exists at _id="${NEW_ID}". Aborting to avoid overwrite.`)
    process.exit(1)
  }

  const {_id, _rev, _createdAt, _updatedAt, ...content} = oldPublished
  const created = await client.createIfNotExists({_id: NEW_ID, ...content})
  console.log(`✓ Created ${created._id}`)

  await client.delete(OLD_ID)
  console.log(`✓ Deleted published ${OLD_ID}`)

  if (oldDraft) {
    await client.delete(`drafts.${OLD_ID}`)
    console.log(`✓ Deleted draft drafts.${OLD_ID}`)
  }

  console.log('Migration complete. Refresh the Studio.')
}

main().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
