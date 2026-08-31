import type { RequiredTool } from '@vmc-hmi/shared'
import { ActionButton } from '../shared/ActionButton'
import { SingleItemChecklist } from '../shared/SingleItemChecklist'

interface ToolsStageProps {
  items: RequiredTool[]
  pending: boolean
  onConfirm: (id: string) => void
  onNext: () => void
}

export function ToolsStage({ items, pending, onConfirm, onNext }: ToolsStageProps) {
  const allConfirmed = items.every((item) => item.confirmed)

  return (
    <div className="flex flex-col gap-8">
      <SingleItemChecklist
        items={items}
        itemNoun="tool"
        pending={pending}
        onConfirm={onConfirm}
        renderItem={(tool) => ({
          title: `${tool.toolNumber} — ${tool.type}`,
          detail: `Program ${tool.programRevision}`,
        })}
      />
      {allConfirmed && (
        <ActionButton variant="primary" loading={pending} onClick={onNext}>
          Next: Workpiece Setup
        </ActionButton>
      )}
    </div>
  )
}
