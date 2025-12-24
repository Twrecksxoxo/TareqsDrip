'use client'
import { useEffect, useState } from "react"
import axios from "axios"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"
import { useUser,useAuth } from "@clerk/nextjs"


const AdminLayout = ({ children }) => {

    const {user} = useUser()
    const {getToken} = useAuth()

    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchIsAdmin = async () => {
        try {
            console.log('👤 User object:', user)
            console.log('📧 User email:', user?.emailAddresses?.[0]?.emailAddress)
            const token = await getToken()
            console.log('🎫 Token:', token ? 'Token received' : 'No token')
            const {data} = await axios.get('/api/admin/is-admin', {headers: {Authorization: `Bearer ${token}`}})
            setIsAdmin(data.isAdmin)
        } catch (error) {
            console.log('❌ Error fetching isAdmin:', error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log('🔄 User state changed:', user ? 'User exists' : 'No user')
        if(user){
            fetchIsAdmin()
        } else {
            setLoading(false)
        }       
    }, [user])

    return loading ? (
        <Loading />
    ) : isAdmin ? (
        <div className="flex flex-col h-screen">
            <AdminNavbar />
            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <AdminSidebar />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
                    {children}
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">You are not authorized to access this page</h1>
            <Link href="/" className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full">
                Go to home <ArrowRightIcon size={18} />
            </Link>
        </div>
    )
}

export default AdminLayout