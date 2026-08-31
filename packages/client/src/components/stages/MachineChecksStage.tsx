import type { ChecklistItem } from '@vmc-hmi/shared'
import { ActionButton } from '../shared/ActionButton'
import { SingleItemChecklist } from '../shared/SingleItemChecklist'

interface MachineChecksStageProps {
  items: ChecklistItem[]
  onConfirm: (id: string) => void
  onNext: () => void
}

export function MachineChecksStage({ items, onConfirm, onNext }: MachineChecksStageProps) {
  const allConfirmed = items.every((item) => item.confirmed)

  return (
    <div className="flex flex-col gap-8">
      <SingleItemChecklist
        items={items}
        itemNoun="check"
        onConfirm={onConfirm}
        renderItem={(item) => ({ title: item.label, detail: item.detail })}
      />
      {allConfirmed && (
        <ActionButton variant="primary" onClick={onNext}>
          Next: Required Tools
        </ActionButton>
      )}
    </div>
  )
}
