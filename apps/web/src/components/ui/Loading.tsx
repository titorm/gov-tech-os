import React from 'react'
import { MaterialIcon } from './MaterialIcon'
import { cn } from '@repo/ui/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', className }) => {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <MaterialIcon
        name="refresh"
        size={sizeMap[size]}
        className="animate-spin text-muted-foreground"
      />
    </div>
  )
}