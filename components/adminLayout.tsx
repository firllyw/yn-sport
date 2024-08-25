import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import Cookies from 'js-cookie'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleLogout = () => {
    Cookies.remove('adminSessionToken')
    router.push('/admin')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="secondary">Logout</Button>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
    </div>
  )
}