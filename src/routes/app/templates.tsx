import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/templates')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/templates"!</div>
}
