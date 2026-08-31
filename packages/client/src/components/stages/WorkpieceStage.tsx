import type { ChecklistItem } from '@vmc-hmi/shared'
import { ActionButton } from '../shared/ActionButton'
import { SingleItemChecklist } from '../shared/SingleItemChecklist'

interface WorkpieceStageProps {
  items: ChecklistItem[]
  pending: boolean
  onConfirm: (id: string) => void
  onNext: () => void
}

export function WorkpieceStage({ items, pending, onConfirm, onNext }: WorkpieceStageProps) {
  const allConfirmed = items.every((item) => item.confirmed)

  return (
    <div className="flex flex-col gap-8">
      <SingleItemChecklist
        items={items}
        itemNoun="item"
        pending={pending}
        onConfirm={onConfirm}
        renderItem={(item) => ({ title: item.label, detail: item.detail })}
      />
      {allConfirmed && (
        <ActionButton variant="primary" loading={pending} onClick={onNext}>
          Next: Ready Review
        </ActionButton>
      )}
    </div>
  )
}
