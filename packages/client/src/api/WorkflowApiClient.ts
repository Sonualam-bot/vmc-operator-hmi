import type { WorkflowState } from '@vmc-hmi/shared'
import type { IWorkflowClient } from './IWorkflowClient'

const BASE_URL = '/api/workflow'

async function request(path: string, method: 'GET' | 'POST' = 'GET'): Promise<WorkflowState> {
  const res = await fetch(`${BASE_URL}${path}`, { method })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(body.error ?? `Request failed with status ${res.status}`)
  }
  return res.json()
}

export class WorkflowApiClient implements IWorkflowClient {
  getState(): Promise<WorkflowState> {
    return request('')
  }

  confirmMachineCheck(id: string): Promise<WorkflowState> {
    return request(`/machine-checks/${id}/confirm`, 'POST')
  }

  confirmTool(id: string): Promise<WorkflowState> {
    return request(`/tools/${id}/confirm`, 'POST')
  }

  confirmWorkpieceItem(id: string): Promise<WorkflowState> {
    return request(`/workpiece/${id}/confirm`, 'POST')
  }

  advanceStage(): Promise<WorkflowState> {
    return request('/advance', 'POST')
  }

  startOperation(): Promise<WorkflowState> {
    return request('/operation/start', 'POST')
  }

  stopOperation(): Promise<WorkflowState> {
    return request('/operation/stop', 'POST')
  }

  reset(): Promise<WorkflowState> {
    return request('/reset', 'POST')
  }
}
