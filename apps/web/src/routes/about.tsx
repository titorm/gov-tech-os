import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { MaterialIcon } from '../components/ui/MaterialIcon'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  const features = [
    {
      icon: 'construction',
      title: 'NestJS + Fastify',
      description: 'High-performance backend with Drizzle ORM and PostgreSQL'
    },
    {
      icon: 'web',
      title: 'React + TanStack',
      description: 'Modern frontend with TanStack Router and Query'
    },
    {
      icon: 'phone_android',
      title: 'React Native + Expo',
      description: 'Cross-platform mobile app with native performance'
    },
    {
      icon: 'palette',
      title: 'Material Design 3',
      description: 'Beautiful, consistent design system across all platforms'
    },
    {
      icon: 'cloud',
      title: 'Vercel Deploy',
      description: 'Seamless deployment with CI/CD pipelines'
    },
    {
      icon: 'hub',
      title: 'Turborepo',
      description: 'Monorepo management with optimized build caching'
    }
  ]

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About This Project</h1>
          <p className="text-lg text-gray-600">
            A comprehensive full-stack application template with modern technologies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MaterialIcon name={feature.icon} className="mr-3 text-primary" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}