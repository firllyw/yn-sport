import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Cookies from 'js-cookie'

export default function AdminPage() {
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passphrase === 'ynsport!') {
      // Generate a simple session token (in a real app, use a more secure method)
      const sessionToken = Math.random().toString(36).substring(2, 15)
      
      // Store the session token in a cookie that expires in 1 day
      Cookies.set('adminSessionToken', sessionToken, { expires: 1 })
      
      router.push('/admin/events')
    } else {
      setError('Incorrect passphrase')
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="passphrase" className="text-sm font-medium">Passphrase</Label>
              <Input
                id="passphrase"
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                required
                className="mt-1 w-full"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}