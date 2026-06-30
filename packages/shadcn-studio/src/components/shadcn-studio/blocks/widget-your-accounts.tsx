import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { PlusIcon, CheckIcon, EllipsisIcon } from "lucide-react"

const listItems = ['Edit', 'Make Admin', 'Delete']

type Props = {
  title: string
  userData: {
    name: string
    accountType: string
    avatarUrl: string
    isVerified?: boolean
  }[]
  className?: string
}

const YourAccountsCard = ({ title, userData, className }: Props) => {
  return (
    <Card className={className}>
      <CardHeader className='flex justify-between'>
        <div className='flex flex-col gap-1'>
          <span className='text-lg font-semibold'>{title}</span>
          <span className='text-muted-foreground text-sm'>You have {userData.length} accounts</span>
        </div>
        <Button variant='outline' className='rounded-full'>
          <PlusIcon
          />
          Add accounts
        </Button>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col gap-4'>
        {userData.map((user, index) => (
          <div key={index} className='flex flex-1 flex-col justify-between gap-4'>
            <div className='flex justify-between gap-4'>
              <div className='flex items-center gap-4'>
                {user.isVerified ? (
                  <Avatar className='ring-offset-background ring-2 ring-green-600 dark:ring-green-400'>
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className='text-xs uppercase'>{user.name.charAt(0)}</AvatarFallback>
                    <AvatarBadge className='-right-1.5 -bottom-1.5 bg-green-600 group-data-[size=default]/avatar:size-4 dark:bg-green-400'>
                      <CheckIcon className='size-3! text-white' />
                    </AvatarBadge>
                  </Avatar>
                ) : (
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className='text-xs uppercase'>{user.name.charAt(0)}</AvatarFallback>
                    <AvatarBadge className='-right-0.5 -bottom-0.5 bg-green-600 group-data-[size=default]/avatar:size-3 dark:bg-green-400'>
                      <span className='sr-only'>Available</span>
                    </AvatarBadge>
                  </Avatar>
                )}
                <div className='flex flex-col'>
                  <span className='text-lg'>@{user.name}</span>
                  <span className='text-muted-foreground text-sm'>{user.accountType}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant='ghost' size='icon' className='text-muted-foreground size-6 rounded-full' />}
                >
                  <EllipsisIcon
                  />
                  <span className='sr-only'>Edit menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                  <DropdownMenuGroup>
                    {listItems.map((item, idx) => (
                      <DropdownMenuItem key={idx}>{item}</DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index !== userData.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default YourAccountsCard
