'use client'

import {FadeIn} from '@/app/components/ui/FadeIn'

type PricingMatrixDisplayProps = {
  tables?: Array<{
    _key: string
    tableName?: string
    tableDescription?: string
    columnHeaders?: string[]
    rows?: Array<{
      _key: string
      rowLabel?: string
      cells?: Array<{
        _key: string
        value?: string
        note?: string
      }>
    }>
  }>
  footnotes?: string[]
}

export default function PricingMatrixDisplay({tables, footnotes}: PricingMatrixDisplayProps) {
  if (!tables) return null

  return (
    <>
      {tables.map((table, ti) => (
        <FadeIn key={table._key} delay={0.1 * ti} className={ti < tables.length - 1 ? 'mb-20' : ''}>
          <div>
            {table.tableName && (
              <h3 className="text-[24px] md:text-[32px] leading-[120%] text-forest mb-2">
                {table.tableName}
              </h3>
            )}
            {table.tableDescription && (
              <p className="font-sans text-[14px] md:text-[16px] text-charcoal/60 mb-6">
                {table.tableDescription}
              </p>
            )}

            {/* Desktop: full table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-forest text-cream">
                    <th className="text-left font-sans text-[14px] font-medium uppercase tracking-wider px-4 py-3 rounded-tl-lg">
                      &nbsp;
                    </th>
                    {table.columnHeaders?.map((header, hi) => (
                      <th
                        key={hi}
                        className={`w-[200px] text-center font-sans text-[14px] font-medium px-4 py-3 ${hi === (table.columnHeaders?.length ?? 0) - 1 ? 'rounded-tr-lg' : ''}`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows?.map((row, ri) => (
                    <tr key={row._key} className={ri % 2 === 0 ? 'bg-sand/30' : 'bg-cream'}>
                      <td className="font-sans text-[14px] md:text-[16px] font-medium text-forest px-4 py-3">
                        {row.rowLabel}
                      </td>
                      {row.cells?.map((cell) => (
                        <td key={cell._key} className="text-center px-4 py-3">
                          {cell.value ? (
                            <div>
                              <span className="font-sans text-[16px] md:text-[18px] font-medium text-terracotta">
                                {cell.value}
                              </span>
                              {cell.note && (
                                <p className="font-sans text-[14px] italic text-charcoal/50 mt-0.5">
                                  {cell.note}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-charcoal/30">&mdash;</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: adaptive layout based on table type */}
            <div className="md:hidden">
              {(table.columnHeaders?.length ?? 0) <= 1 ? (
                /* Simple list (A La Carte style) — menu-style rows */
                <div className="rounded-lg overflow-hidden">
                  {table.rows?.map((row, ri) => (
                    <div
                      key={row._key}
                      className={`flex items-baseline justify-between px-4 py-3 ${ri % 2 === 0 ? 'bg-sand/30' : 'bg-cream'}`}
                    >
                      <span className="font-sans text-[14px] font-medium text-forest mr-2">
                        {row.rowLabel}
                      </span>
                      <span className="shrink-0 border-b border-dashed border-charcoal/20 flex-1 mx-2 mb-1" />
                      <span className="shrink-0 font-sans text-[16px] font-medium text-terracotta">
                        {row.cells?.[0]?.value ? (
                          <>
                            {row.cells[0].value}
                            {row.cells[0].note && (
                              <span className="block font-sans text-[14px] italic text-charcoal/50 text-right">
                                {row.cells[0].note}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-charcoal/30">&mdash;</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                /* Multi-column (Grooming by Size) — stacked cards */
                <div className="space-y-4">
                  {table.rows?.map((row) => (
                    <div key={row._key} className="bg-sand/30 rounded-lg p-4">
                      <h4 className="font-sans text-[15px] font-semibold text-forest mb-2">
                        {row.rowLabel}
                      </h4>
                      <div className="space-y-1.5">
                        {table.columnHeaders?.map((header, hi) => {
                          const cell = row.cells?.[hi]
                          return (
                            <div key={hi} className="flex items-baseline justify-between">
                              <span className="font-sans text-[14px] text-charcoal/70">
                                {header}
                              </span>
                              <span className="font-sans text-[15px] font-medium text-terracotta">
                                {cell?.value || <span className="text-charcoal/30">&mdash;</span>}
                              </span>
                            </div>
                          )
                        })}
                        {row.cells?.some((c) => c.note) && (
                          <div className="pt-1">
                            {row.cells
                              .filter((c) => c.note)
                              .map((c) => (
                                <p
                                  key={c._key}
                                  className="font-sans text-[14px] italic text-charcoal/50"
                                >
                                  {c.note}
                                </p>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      ))}

      {footnotes && footnotes.length > 0 && (
        <FadeIn delay={0.2}>
          <div className="mt-8 space-y-1">
            {footnotes.map((note, i) => (
              <p key={i} className="font-sans text-[14px] text-charcoal/60 italic">
                {note}
              </p>
            ))}
          </div>
        </FadeIn>
      )}
    </>
  )
}
