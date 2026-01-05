'use client'

import Loading from "@/components/Loading"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { ImageIcon, Trash2, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

export default function LookbookPage() {
    const [lookbookImages, setLookbookImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [newImage, setNewImage] = useState(null)
    const [newTitle, setNewTitle] = useState("")
    const [newDescription, setNewDescription] = useState("")

    const { getToken } = useAuth()

    const fetchLookbook = async () => {
        try {
            setLoading(true)
            const token = await getToken()
            const { data } = await axios.get('/api/admin/lookbook', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setLookbookImages(data.lookbook || [])
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Failed to fetch lookbook images')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLookbook()
    }, [])

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!newImage) {
            return toast.error('Please select an image')
        }

        try {
            setUploading(true)
            const token = await getToken()
            const formData = new FormData()
            formData.append('image', newImage)
            formData.append('title', newTitle)
            formData.append('description', newDescription)
            formData.append('sortOrder', lookbookImages.length)

            await axios.post('/api/admin/lookbook', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })

            toast.success('Image added to lookbook!')
            setNewImage(null)
            setNewTitle("")
            setNewDescription("")
            fetchLookbook()
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Failed to upload image')
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this image?')) return

        try {
            const token = await getToken()
            await axios.delete(`/api/admin/lookbook?id=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success('Image deleted from lookbook')
            fetchLookbook()
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Failed to delete image')
        }
    }

    const handleToggleActive = async (id, currentStatus) => {
        try {
            const token = await getToken()
            await axios.put('/api/admin/lookbook', {
                id,
                isActive: !currentStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success(currentStatus ? 'Image hidden from lookbook' : 'Image shown in lookbook')
            fetchLookbook()
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Failed to update image')
        }
    }

    const handleUpdateOrder = async (id, newOrder) => {
        try {
            const token = await getToken()
            await axios.put('/api/admin/lookbook', {
                id,
                sortOrder: newOrder
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchLookbook()
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Failed to update order')
        }
    }

    if (loading) return <Loading />

    return (
        <div className="text-slate-700 pb-10">
            <h1 className="text-2xl font-medium mb-2">
                <ImageIcon className="inline-block mr-2 mb-1" size={28} />
                Lookbook <span className="text-slate-500 font-normal">Pictures</span>
            </h1>
            <p className="text-slate-500 mb-8">
                Upload model pictures wearing your products. These will be displayed on the lookbook page in a stunning catalogue-style slideshow.
            </p>

            {/* Upload Section */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-medium mb-4">Add New Image</h2>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="flex flex-wrap gap-6">
                        {/* Image Upload */}
                        <div className="flex-shrink-0">
                            <label htmlFor="lookbook-image" className="cursor-pointer block">
                                {newImage ? (
                                    <Image
                                        src={URL.createObjectURL(newImage)}
                                        alt="Preview"
                                        width={200}
                                        height={250}
                                        className="w-48 h-60 object-cover rounded-lg border-2 border-dashed border-slate-300 hover:border-green-500 transition"
                                    />
                                ) : (
                                    <div className="w-48 h-60 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 hover:border-green-500 transition flex flex-col items-center justify-center text-slate-400">
                                        <ImageIcon size={40} />
                                        <span className="mt-2 text-sm">Click to upload</span>
                                    </div>
                                )}
                            </label>
                            <input
                                type="file"
                                id="lookbook-image"
                                accept="image/*"
                                onChange={(e) => setNewImage(e.target.files[0])}
                                hidden
                            />
                        </div>

                        {/* Title & Description */}
                        <div className="flex-1 min-w-[250px] space-y-4">
                            <div>
                                <label className="block text-sm text-slate-600 mb-1">
                                    Title (optional)
                                </label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="e.g., Summer Collection 2026"
                                    className="w-full p-2 px-4 border border-slate-200 rounded outline-none focus:border-green-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-600 mb-1">
                                    Description (optional)
                                </label>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="Brief description of the look..."
                                    rows={3}
                                    className="w-full p-2 px-4 border border-slate-200 rounded outline-none focus:border-green-500 transition resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={uploading || !newImage}
                                className="bg-slate-800 text-white px-6 py-2 rounded hover:bg-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? 'Uploading...' : 'Add to Lookbook'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Existing Images Grid */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">
                        Lookbook Gallery ({lookbookImages.length} images)
                    </h2>
                    <a
                        href="/lookbook"
                        target="_blank"
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                        View Public Page →
                    </a>
                </div>

                {lookbookImages.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
                        <p>No lookbook images yet. Upload your first one above!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {lookbookImages.map((item, index) => (
                            <div
                                key={item.id}
                                className={`relative group rounded-lg overflow-hidden border ${
                                    item.isActive ? 'border-slate-200' : 'border-red-200 opacity-60'
                                }`}
                            >
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title || 'Lookbook image'}
                                    width={300}
                                    height={400}
                                    className="w-full h-48 object-cover"
                                />

                                {/* Overlay with controls */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleActive(item.id, item.isActive)}
                                            className={`p-2 rounded-full transition ${
                                                item.isActive 
                                                    ? 'bg-yellow-500 hover:bg-yellow-600' 
                                                    : 'bg-green-500 hover:bg-green-600'
                                            }`}
                                            title={item.isActive ? 'Hide from lookbook' : 'Show in lookbook'}
                                        >
                                            {item.isActive ? <EyeOff size={16} className="text-white" /> : <Eye size={16} className="text-white" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition"
                                            title="Delete image"
                                        >
                                            <Trash2 size={16} className="text-white" />
                                        </button>
                                    </div>

                                    {/* Sort order controls */}
                                    <div className="flex items-center gap-1 mt-2">
                                        <button
                                            onClick={() => handleUpdateOrder(item.id, Math.max(0, item.sortOrder - 1))}
                                            disabled={index === 0}
                                            className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-xs disabled:opacity-30"
                                        >
                                            ← Up
                                        </button>
                                        <span className="text-white text-xs px-2">#{index + 1}</span>
                                        <button
                                            onClick={() => handleUpdateOrder(item.id, item.sortOrder + 1)}
                                            disabled={index === lookbookImages.length - 1}
                                            className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-xs disabled:opacity-30"
                                        >
                                            Down →
                                        </button>
                                    </div>
                                </div>

                                {/* Title overlay */}
                                {item.title && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                        <p className="text-white text-xs truncate">{item.title}</p>
                                    </div>
                                )}

                                {/* Hidden badge */}
                                {!item.isActive && (
                                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                        Hidden
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

