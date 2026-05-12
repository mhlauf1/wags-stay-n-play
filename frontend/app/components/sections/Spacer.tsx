const heights: Record<string, string> = {
  sm: 'h-8',
  md: 'h-16',
  lg: 'h-24',
  xl: 'h-32',
}

type SpacerProps = {
  block: {size?: string}
  index: number
  pageId: string
  pageType: string
}

export default function Spacer({block}: SpacerProps) {
  return <div className={heights[block.size || 'md']} aria-hidden="true" />
}
