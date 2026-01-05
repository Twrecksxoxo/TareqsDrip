import imagekit from "@/configs/imageKit"
import prisma from "@/lib/prisma"
import authAdmin from "@/middleware/authAdmin"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Get all lookbook images (public for GET, admin for mutations)
export async function GET() {
    try {
        const lookbookImages = await prisma.lookbook.findMany({
            where: { isActive: true },
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'desc' }
            ]
        })
        return NextResponse.json({ lookbook: lookbookImages })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Add new lookbook image (admin only)
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const image = formData.get("image")
        const title = formData.get("title") || null
        const description = formData.get("description") || null
        const sortOrder = parseInt(formData.get("sortOrder") || "0")

        if (!image) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 })
        }

        // Upload image to ImageKit
        const buffer = Buffer.from(await image.arrayBuffer())
        const response = await imagekit.upload({
            file: buffer,
            fileName: image.name,
            folder: "lookbook",
        })

        const imageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: "auto" },
                { format: "webp" },
                { width: "1200" }
            ]
        })

        const lookbookEntry = await prisma.lookbook.create({
            data: {
                imageUrl,
                title,
                description,
                sortOrder
            }
        })

        return NextResponse.json({ message: "Lookbook image added successfully", lookbook: lookbookEntry })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Delete lookbook image (admin only)
export async function DELETE(request) {
    try {
        const { userId } = getAuth(request)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Lookbook ID is required' }, { status: 400 })
        }

        await prisma.lookbook.delete({
            where: { id }
        })

        return NextResponse.json({ message: "Lookbook image deleted successfully" })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Update lookbook image (admin only)
export async function PUT(request) {
    try {
        const { userId } = getAuth(request)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
        }

        const body = await request.json()
        const { id, title, description, sortOrder, isActive } = body

        if (!id) {
            return NextResponse.json({ error: 'Lookbook ID is required' }, { status: 400 })
        }

        const updateData = {}
        if (title !== undefined) updateData.title = title
        if (description !== undefined) updateData.description = description
        if (sortOrder !== undefined) updateData.sortOrder = sortOrder
        if (isActive !== undefined) updateData.isActive = isActive

        const lookbookEntry = await prisma.lookbook.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json({ message: "Lookbook updated successfully", lookbook: lookbookEntry })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

