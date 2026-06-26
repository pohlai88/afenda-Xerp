'use client'

import { useState } from 'react'

import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Button } from '#/components/shadcn-studio/primitives/button.tsx'
import { Checkbox } from '#/components/shadcn-studio/primitives/checkbox.tsx'
import { Field, FieldGroup, FieldLabel } from '#/components/shadcn-studio/primitives/field.tsx'
import { Input } from '#/components/shadcn-studio/primitives/input.tsx'
import { InputGroup, InputGroupAddon, InputGroupInput } from '#/components/shadcn-studio/primitives/input-group.tsx'

const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <form className='space-y-4' onSubmit={e => e.preventDefault()}>
      <FieldGroup className='gap-4'>
        {/* Name */}
        <Field>
          <Input type='text' placeholder='Enter your name' />
        </Field>
        {/* Email */}
        <Field>
          <Input type='email' placeholder='Enter your email address' />
        </Field>
        {/* Password */}
        <InputGroup>
          <InputGroupInput id='password' type={isVisible ? 'text' : 'password'} placeholder='••••••••••••••••' />
          <InputGroupAddon align='inline-end' className='pr-1.5'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsVisible(prevState => !prevState)}
              className='text-muted-foreground rounded-l-none hover:bg-transparent'
            >
              {isVisible ? <EyeOffIcon /> : <EyeIcon />}
              <span className='sr-only'>{isVisible ? 'Hide password' : 'Show password'}</span>
            </Button>
          </InputGroupAddon>
        </InputGroup>
        {/* Remember Me and Forgot Password */}
        <div className='flex items-center justify-between gap-y-2'>
          <Field orientation='horizontal' className='flex items-center gap-3'>
            <Checkbox id='rememberMe' className='size-6' />
            <FieldLabel htmlFor='rememberMe' className='text-muted-foreground'>
              Remember Me
            </FieldLabel>
          </Field>
          <a href='#' className='text-nowrap hover:underline'>
            Forgot Password?
          </a>
        </div>
        <Field>
          <Button className='w-full' type='submit'>
            Sign in to Shadcn Studio
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default LoginForm
