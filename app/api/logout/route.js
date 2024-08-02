import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
    cookies().delete('access_token')
    cookies().delete('encrypted_refresh_token')
    redirect('/')
}