import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { AdminLayout } from './adminLayout'

export function withAdminAuth(WrappedComponent: React.ComponentType) {
  return function WithAdminAuth(props: any) {
    const router = useRouter()

    useEffect(() => {
      const sessionToken = Cookies.get('adminSessionToken')
      if (!sessionToken) {
        router.replace('/admin')
      }
    }, [])

    return (
      <AdminLayout>
        <WrappedComponent {...props} />
      </AdminLayout>
    )
  }
}