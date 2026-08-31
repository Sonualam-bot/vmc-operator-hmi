import type { RequiredTool } from '@vmc-hmi/shared'
import { ActionButton } from '../shared/ActionButton'
import { SingleItemChecklist } from '../shared/SingleItemChecklist'

interface ToolsStageProps {
  items: RequiredTool[]
  onConfirm: (id: string) => void
  onNext: () => void
}

export function ToolsStage({ items, onConfirm, onNext }: ToolsStageProps) {
  const allConfirmed = items.every((item) => item.confirmed)

  return (
    <div className="flex flex-col gap-8">
      <SingleItemChecklist
        items={items}
        itemNoun="tool"
        onConfirm={onConfirm}
        renderItem={(tool) => ({
          title: `${tool.toolNumber} — ${tool.type}`,
          detail: `Program ${tool.programRevision}`,
        })}
      />
      {allConfirmed && (
        <ActionButton variant="primary" onClick={onNext}>
          Next: Workpiece Setup
        </ActionButton>
      )}
    </div>
  )
}
