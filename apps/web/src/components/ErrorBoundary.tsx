import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@repo/ui'
import { MaterialIcon } from './ui/MaterialIcon'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <MaterialIcon name="error" className="text-red-600" size={24} />
              </div>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>
                We're sorry, but something unexpected happened.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => this.setState({ hasError: false })}
                className="w-full"
              >
                <MaterialIcon name="refresh" className="mr-2" />
                Try again
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}