import { clerkClient } from "@clerk/nextjs/server";

const authAdmin = async (userID) => {
    try {
        if(!userID) return false

        const client = await clerkClient()
        const user = await client.users.getUser(userID)

        const allowed = (process.env.ADMIN_EMAIL || "")
            .split(',')
            .map(e => e.trim().toLowerCase())
            .filter(Boolean)

        const userEmail = (user.emailAddresses[0]?.emailAddress || "").toLowerCase()

        // Debug logging
        console.log('🔍 Admin Check Debug:')
        console.log('ADMIN_EMAIL env:', process.env.ADMIN_EMAIL)
        console.log('Allowed emails:', allowed)
        console.log('User email:', userEmail)
        console.log('All user emails:', user.emailAddresses.map(e => e.emailAddress))
        console.log('Is admin?:', allowed.includes(userEmail))

        return allowed.includes(userEmail)

    } catch (error) {
        console.error(error)
        return false
    }
}

export default authAdmin;
