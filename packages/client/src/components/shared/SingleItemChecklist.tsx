import { ActionButton } from './ActionButton'

interface Confirmable {
  id: string
  confirmed: boolean
}

interface SingleItemChecklistProps<T extends Confirmable> {
  items: T[]
  itemNoun: string
  pending: boolean
  onConfirm: (id: string) => void
  renderItem: (item: T) => { title: string; detail?: string }
}

export function SingleItemChecklist<T extends Confirmable>({
  items,
  itemNoun,
  pending,
  onConfirm,
  renderItem,
}: SingleItemChecklistProps<T>) {
  const currentIndex = items.findIndex((item) => !item.confirmed)
  const allConfirmed = currentIndex === -1
  const current = allConfirmed ? items[items.length - 1] : items[currentIndex]
  const { title, detail } = renderItem(current)

  return (
    <div className="flex flex-col gap-6">
      <div className="text-sm font-medium text-slate-500">
        {allConfirmed ? `All ${items.length} ${itemNoun} confirmed` : `${itemNoun} ${currentIndex + 1} of ${items.length}`}
      </div>

      <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-2xl font-bold text-slate-900">{title}</div>
        {detail && <div className="mt-2 text-lg text-slate-600">{detail}</div>}
        {allConfirmed && <div className="mt-4 font-semibold text-emerald-600">Confirmed</div>}
      </div>

      {!allConfirmed && (
        <ActionButton variant="primary" loading={pending} onClick={() => onConfirm(current.id)}>
          Confirm Check
        </ActionButton>
      )}

      <ol className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <li
            key={item.id}
            aria-label={`${itemNoun} ${idx + 1} ${item.confirmed ? 'confirmed' : 'pending'}`}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
              item.confirmed
                ? 'bg-emerald-500 text-white'
                : idx === currentIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-500'
            }`}
          >
            {item.confirmed ? '✓' : idx + 1}
          </li>
        ))}
      </ol>
    </div>
  )
}
