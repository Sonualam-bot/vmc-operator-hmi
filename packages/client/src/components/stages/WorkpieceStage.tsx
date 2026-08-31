import type { ChecklistItem } from '@vmc-hmi/shared'
import { ActionButton } from '../shared/ActionButton'
import { SingleItemChecklist } from '../shared/SingleItemChecklist'

interface WorkpieceStageProps {
  items: ChecklistItem[]
  onConfirm: (id: string) => void
  onNext: () => void
}

export function WorkpieceStage({ items, onConfirm, onNext }: WorkpieceStageProps) {
  const allConfirmed = items.every((item) => item.confirmed)

  return (
    <div className="flex flex-col gap-8">
      <SingleItemChecklist
        items={items}
        itemNoun="item"
        onConfirm={onConfirm}
        renderItem={(item) => ({ title: item.label, detail: item.detail })}
      />
      {allConfirmed && (
        <ActionButton variant="primary" onClick={onNext}>
          Next: Ready Review
        </ActionButton>
      )}
    </div>
  )
}
