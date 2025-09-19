import { createFileRoute } from '@tanstack/react-router'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { MaterialIcon } from '../components/ui/MaterialIcon'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your App
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            A modern full-stack application built with the latest technologies
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">
              <MaterialIcon name="rocket_launch" className="mr-2" />
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              <MaterialIcon name="info" className="mr-2" />
              Learn More
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MaterialIcon name="speed" className="mr-2 text-primary" />
                Fast
              </CardTitle>
              <CardDescription>
                Built with Vite for lightning-fast development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Experience blazing fast hot module replacement and optimized builds
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MaterialIcon name="security" className="mr-2 text-primary" />
                Secure
              </CardTitle>
              <CardDescription>
                Type-safe with TypeScript and validated APIs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Full type safety from database to UI with comprehensive validation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MaterialIcon name="palette" className="mr-2 text-primary" />
                Beautiful
              </CardTitle>
              <CardDescription>
                Material Design 3 with shadcn/ui components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Modern, accessible, and beautiful UI components out of the box
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}