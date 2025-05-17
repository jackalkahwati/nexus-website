import { jest } from '@jest/globals'
import { Card } from 'components/ui/card'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'

const LoginPage = () => {
  const handleSubmit = jest.fn()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              className="mt-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              className="mt-1 w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default LoginPage 