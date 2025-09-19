import React from 'react'
import { cn } from '@repo/ui/lib/utils'

interface MaterialIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string
  size?: number
  filled?: boolean
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700
  grade?: -25 | 0 | 200
  opticalSize?: number
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  size = 24,
  filled = false,
  weight = 400,
  grade = 0,
  opticalSize = 24,
  className,
  style,
  ...props
}) => {
  const iconStyle = {
    fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
    fontSize: size,
    ...style,
  }

  return (
    <span
      className={cn('material-symbols-outlined select-none', className)}
      style={iconStyle}
      {...props}
    >
      {name}
    </span>
  )
}