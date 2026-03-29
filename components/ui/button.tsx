import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles — rounded, smooth transition, focus ring
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold font-body ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        // Warm amber — the main CTA
        default:
          'bg-amber-500 text-white hover:bg-amber-600 shadow-soft hover:shadow-hover',
        // Soft secondary
        secondary:
          'bg-soft-blue/40 text-warm-brown hover:bg-soft-blue/70 border border-soft-blue',
        // Ghost (nav links, subtle actions)
        ghost:
          'hover:bg-warm-yellow/40 text-warm-brown',
        // Outlined
        outline:
          'border-2 border-amber-400 bg-transparent text-amber-600 hover:bg-amber-50',
        // For destructive / remove actions (not used much here, but handy)
        destructive:
          'bg-red-400 text-white hover:bg-red-500',
        // Soft link style
        link:
          'text-amber-600 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm:      'h-9 px-4 text-xs',
        lg:      'h-13 px-8 text-base',
        icon:    'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size:    'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
