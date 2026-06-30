import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import InitializePipelineDialog from '@/components/shadcn-studio/blocks/dashboard-dialog-25/dialog-pipeline-configuration'
import { WorkflowIcon, PlusIcon } from "lucide-react"

function EmptyState() {
  return (
    <Card className='w-full max-w-lg'>
      <CardHeader className='gap-0'>
        <CardTitle>Automation</CardTitle>
        <CardDescription>Initialize the automation process by CI/CD</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='rounded-md border border-dashed p-6 text-center'>
          <WorkflowIcon className='text-muted-foreground mx-auto size-12' />
          <p className='mt-2 text-sm font-medium'>No automation tasks available</p>
          <p className='text-muted-foreground mt-1 text-sm'>
            Please check back later or configure your automation settings.
          </p>
          <InitializePipelineDialog
            trigger={
              <Button size='sm' className='mt-4'>
                <PlusIcon
                />
                <span>Initialize Pipeline</span>
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default EmptyState
