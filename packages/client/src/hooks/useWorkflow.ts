import { useCallback, useEffect, useRef, useState } from 'react'
import type { WorkflowState } from '@vmc-hmi/shared'
import type { IWorkflowClient } from '../api/IWorkflowClient'

export interface UseWorkflowResult {
  state: WorkflowState | null
  loading: boolean
  pending: boolean
  error: string | null
  confirmMachineCheck: (id: string) => void
  confirmTool: (id: string) => void
  confirmWorkpieceItem: (id: string) => void
  advanceStage: () => void
  startOperation: () => void
  stopOperation: () => void
  reset: () => void
}

// A real request can resolve in a couple of milliseconds, which is faster
// than a spinner can actually be seen — enforce a floor so the loading
// state always renders as a visible, legible indicator rather than a flash.
const MIN_PENDING_MS = 300

export function useWorkflow(client: IWorkflowClient): UseWorkflowResult {
  const [state, setState] = useState<WorkflowState | null>(null)
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pendingRef = useRef(false)

  const run = useCallback((action: () => Promise<WorkflowState>) => {
    if (pendingRef.current) {
      return
    }
    pendingRef.current = true
    setPending(true)
    setError(null)
    const startedAt = Date.now()

    action()
      .then(setState)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      })
      .finally(() => {
        const remaining = MIN_PENDING_MS - (Date.now() - startedAt)
        setTimeout(
          () => {
            pendingRef.current = false
            setPending(false)
          },
          remaining > 0 ? remaining : 0,
        )
      })
  }, [])

  useEffect(() => {
    setLoading(true)
    client
      .getState()
      .then(setState)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      })
      .finally(() => setLoading(false))
  }, [client])

  return {
    state,
    loading,
    pending,
    error,
    confirmMachineCheck: (id) => run(() => client.confirmMachineCheck(id)),
    confirmTool: (id) => run(() => client.confirmTool(id)),
    confirmWorkpieceItem: (id) => run(() => client.confirmWorkpieceItem(id)),
    advanceStage: () => run(() => client.advanceStage()),
    startOperation: () => run(() => client.startOperation()),
    stopOperation: () => run(() => client.stopOperation()),
    reset: () => run(() => client.reset()),
  }
}
