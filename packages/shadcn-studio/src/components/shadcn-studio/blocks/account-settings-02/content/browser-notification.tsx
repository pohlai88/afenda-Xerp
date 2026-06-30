import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { CircleQuestionMarkIcon } from "lucide-react"

const BrowserNotification = () => {
  return (
    <div className='grid min-w-0 w-full grid-cols-1 gap-10 xl:grid-cols-3'>
      {/* Vertical Tabs List */}
      <div className='flex flex-col space-y-1'>
        <h3 className='font-semibold'>Browser Notifications</h3>
        <p className='text-muted-foreground text-sm'>Manage your browser notification settings and preferences.</p>
      </div>

      {/* Content */}
      <div className='space-y-4 min-w-0 xl:col-span-2'>
        <div className='space-y-3'>
          <div className='flex items-center gap-4'>
            <Checkbox id='assigned-to-you' />
            <Label htmlFor='assigned-to-you' className='text-sm leading-normal font-medium'>
              Assigned to You
            </Label>
          </div>
          <div className='flex items-center gap-4'>
            <Checkbox id='unassigned' />
            <Label htmlFor='unassigned' className='text-sm leading-normal font-medium'>
              Unassigned
            </Label>
          </div>
          <div className='flex items-center gap-4'>
            <Checkbox id='assigned-to-teams' />
            <Label htmlFor='assigned-to-teams' className='text-sm leading-normal font-medium'>
              Assigned to any of your teams
            </Label>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <p className='flex items-center gap-1 text-sm font-medium'>
            Play sound when your tab blinks
            <Tooltip>
              <TooltipTrigger
                render={
                  <CircleQuestionMarkIcon className='size-4' />
                }
              ></TooltipTrigger>
              <TooltipContent>
                <p>Play sound on alert</p>
              </TooltipContent>
            </Tooltip>
          </p>
          <Switch className='cursor-pointer' />
        </div>
      </div>
    </div>
  )
}

export default BrowserNotification
