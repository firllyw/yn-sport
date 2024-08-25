import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/router'

export default function HomePage() {
  const router = useRouter()

  const handleSeeEvents = () => {
    router.push('/event')
  }

  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl text-center">Welcome to YN Sport</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-center mb-6">Join us for exciting mini soccer matches!</p>
          <Button onClick={handleSeeEvents} size="lg">
            See Our Upcoming Matches
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}