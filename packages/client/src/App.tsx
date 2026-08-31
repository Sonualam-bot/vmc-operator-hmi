import { useMemo } from 'react'
import { WorkflowApiClient } from './api/WorkflowApiClient'
import { StageRouter } from './components/StageRouter'
import { StageShell } from './components/layout/StageShell'
import { useWorkflow } from './hooks/useWorkflow'

function CenteredMessage({ text }: { text: string }) {
  return <div className="flex min-h-screen items-center justify-center bg-slate-100 text-lg font-medium text-slate-600">{text}</div>
}

function App() {
  const client = useMemo(() => new WorkflowApiClient(), [])
  const workflow = useWorkflow(client)

  if (workflow.loading) {
    return <CenteredMessage text="Loading…" />
  }

  if (!workflow.state) {
    return <CenteredMessage text={workflow.error ? `Failed to load: ${workflow.error}` : 'No workflow state available.'} />
  }

  return (
    <StageShell state={workflow.state} onReset={workflow.reset}>
      {workflow.error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{workflow.error}</div>
      )}
      <StageRouter state={workflow.state} workflow={workflow} />
    </StageShell>
  )
}

export default App
