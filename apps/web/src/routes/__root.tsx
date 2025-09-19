import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Button } from '@repo/ui'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          <Button variant="ghost">Home</Button>
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          <Button variant="ghost">About</Button>
        </Link>
        <Link to="/dashboard" className="[&.active]:font-bold">
          <Button variant="ghost">Dashboard</Button>
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})