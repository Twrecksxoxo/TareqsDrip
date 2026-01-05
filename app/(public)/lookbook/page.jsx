'use client'

import { useEffect, useState, useCallback, useRef } from "react"
import axios from "axios"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react"
import Link from "next/link"

export default function LookbookPage() {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [viewMode, setViewMode] = useState('slideshow') // 'slideshow' or 'grid'
    const intervalRef = useRef(null)

    useEffect(() => {
        const fetchLookbook = async () => {
            try {
                const { data } = await axios.get('/api/lookbook')
                console.log('Lookbook data:', data)
                setImages(data.lookbook || [])
            } catch (err) {
                console.error('Failed to fetch lookbook:', err)
                setError(err.message || 'Failed to load lookbook')
            } finally {
                setLoading(false)
            }
        }
        fetchLookbook()
    }, [])

    const goToNext = useCallback(() => {
        if (images.length === 0 || isTransitioning) return
        setIsTransitioning(true)
        setCurrentIndex((prev) => (prev + 1) % images.length)
        setTimeout(() => setIsTransitioning(false), 1000)
    }, [images.length, isTransitioning])

    const goToPrev = useCallback(() => {
        if (images.length === 0 || isTransitioning) return
        setIsTransitioning(true)
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
        setTimeout(() => setIsTransitioning(false), 1000)
    }, [images.length, isTransitioning])

    const goToIndex = useCallback((index) => {
        if (isTransitioning || index === currentIndex) return
        setIsTransitioning(true)
        setCurrentIndex(index)
        setTimeout(() => setIsTransitioning(false), 1000)
    }, [currentIndex, isTransitioning])

    // Auto-play slideshow
    useEffect(() => {
        if (isPlaying && images.length > 1 && viewMode === 'slideshow') {
            intervalRef.current = setInterval(goToNext, 5000)
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isPlaying, images.length, goToNext, viewMode])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (viewMode !== 'slideshow') return
            if (e.key === 'ArrowLeft') goToPrev()
            if (e.key === 'ArrowRight') goToNext()
            if (e.key === ' ') {
                e.preventDefault()
                setIsPlaying(prev => !prev)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [goToNext, goToPrev, viewMode])

    // Elegant loading screen - Light Pink Theme
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-8">
                        <div className="absolute inset-0 border border-pink-300/50 rounded-full animate-ping"></div>
                        <div className="absolute inset-2 border border-rose-400/60 rounded-full animate-pulse"></div>
                        <div className="absolute inset-4 border-t-2 border-pink-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-rose-400 tracking-[0.5em] text-xs uppercase">Loading</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-5xl font-extralight tracking-[0.3em] mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">LOOKBOOK</h1>
                    <p className="text-red-400/80 text-sm">{error}</p>
                </div>
            </div>
        )
    }

    if (images.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
                {/* Animated background gradient orbs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-200/40 to-rose-300/30 rounded-full blur-3xl animate-blob"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-fuchsia-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-rose-100/50 to-pink-200/40 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <div className="text-center z-10">
                    <div className="mb-8">
                        <Sparkles className="w-12 h-12 text-pink-400 mx-auto animate-pulse" />
                    </div>
                    <h1 className="text-6xl md:text-8xl font-extralight tracking-[0.2em] mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent"
                        style={{ fontFamily: '"Didot", "Bodoni MT", "Playfair Display", Georgia, serif' }}>
                        LOOKBOOK
                    </h1>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto my-8"></div>
                    <p className="text-rose-400/70 tracking-[0.4em] text-sm uppercase mb-12">Coming Soon</p>
                    <Link href="/shop" className="inline-block px-8 py-3 border border-pink-300 text-rose-500 text-sm tracking-[0.2em] uppercase hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 hover:text-white hover:border-transparent transition-all duration-500 rounded-full">
                        Shop Collection
                    </Link>
                </div>
            </div>
        )
    }

    const currentImage = images[currentIndex]

    // Grid View - Light Pink Theme
    if (viewMode === 'grid') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-purple-50 text-slate-800">
                {/* Elegant Header */}
                <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-pink-100">
                    <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                        <h1 className="text-2xl font-extralight tracking-[0.3em] bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent"
                            style={{ fontFamily: '"Didot", "Bodoni MT", "Playfair Display", Georgia, serif' }}>
                            LOOKBOOK
                        </h1>
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setViewMode('slideshow')}
                                className="text-xs tracking-[0.2em] uppercase text-slate-400 hover:text-pink-500 transition-colors"
                            >
                                Slideshow
                            </button>
                            <span className="text-pink-200">|</span>
                            <span className="text-xs tracking-[0.2em] uppercase text-pink-500">
                                Gallery
                            </span>
                        </div>
                    </div>
                </div>

                {/* Masonry Grid */}
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                        {images.map((img, index) => (
                            <div
                                key={img.id}
                                className="break-inside-avoid group cursor-pointer"
                                onClick={() => {
                                    setCurrentIndex(index)
                                    setViewMode('slideshow')
                                }}
                            >
                                <div className="relative overflow-hidden rounded-2xl shadow-lg shadow-pink-100/50 bg-white">
                                    <Image
                                        src={img.imageUrl}
                                        alt={img.title || `Look ${index + 1}`}
                                        width={600}
                                        height={800}
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                        quality={100}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    {/* Hover overlay - only appears on hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100">
                                        <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            {img.title && (
                                                <p className="text-white text-lg tracking-[0.2em] font-light drop-shadow-lg">{img.title}</p>
                                            )}
                                            <p className="text-white/90 text-xs tracking-[0.3em] uppercase mt-2 drop-shadow">View Look</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Slideshow View (Default) - Light Pink Theme
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-purple-50 relative overflow-hidden">
            {/* Soft dreamy background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={currentImage.imageUrl}
                    alt=""
                    fill
                    className="object-cover blur-3xl opacity-30 scale-125 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-rose-50/50 to-purple-50/70"></div>
            </div>

            {/* Decorative floating orbs */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-pink-200/30 to-rose-300/20 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-fuchsia-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

            {/* Decorative lines */}
            <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-pink-200 to-transparent"></div>
            <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-purple-200 to-transparent"></div>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-40 px-8 py-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.4em] bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent"
                            style={{ fontFamily: '"Didot", "Bodoni MT", "Playfair Display", Georgia, serif' }}>
                            LOOKBOOK
                        </h1>
                        <p className="text-rose-400/60 tracking-[0.5em] text-[10px] uppercase mt-2">
                            Tareq&apos;s Drip • 2026 Collection
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-slate-600 text-xs tracking-[0.2em] uppercase">
                            Gallery
                        </span>
                        <span className="text-pink-200">|</span>
                        <button
                            onClick={() => setViewMode('grid')}
                            className="text-xs tracking-[0.2em] uppercase text-slate-400 hover:text-pink-500 transition-colors"
                        >
                            View All
                        </button>
                    </div>
                </div>
            </div>

            {/* Main slideshow */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-12 lg:px-24">
                {/* Side navigation hints */}
                <button
                    onClick={goToPrev}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 group"
                >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-pink-200 bg-white/50 backdrop-blur-sm flex items-center justify-center group-hover:border-pink-400 group-hover:bg-white/80 transition-all duration-500 shadow-lg shadow-pink-100/50">
                        <ChevronLeft className="w-6 h-6 text-rose-400 group-hover:text-pink-600 transition-colors" />
                    </div>
                </button>

                <button
                    onClick={goToNext}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 group"
                >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-pink-200 bg-white/50 backdrop-blur-sm flex items-center justify-center group-hover:border-pink-400 group-hover:bg-white/80 transition-all duration-500 shadow-lg shadow-pink-100/50">
                        <ChevronRight className="w-6 h-6 text-rose-400 group-hover:text-pink-600 transition-colors" />
                    </div>
                </button>

                {/* Main image container */}
                <div className="relative w-full max-w-4xl mx-auto">
                    {/* Image frame */}
                    <div className="relative aspect-[2/3] md:aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl shadow-pink-200/50">

                        {images.map((img, index) => (
                            <div
                                key={img.id}
                                className={`absolute inset-0 transition-all duration-1000 ease-out ${
                                    index === currentIndex
                                        ? 'opacity-100 scale-100 z-10'
                                        : index === (currentIndex - 1 + images.length) % images.length
                                            ? 'opacity-0 scale-95 -translate-x-full z-0'
                                            : 'opacity-0 scale-95 translate-x-full z-0'
                                }`}
                            >
                                <Image
                                    src={img.imageUrl}
                                    alt={img.title || `Look ${index + 1}`}
                                    fill
                                    className="object-cover rounded-3xl"
                                    priority={index === currentIndex || index === (currentIndex + 1) % images.length}
                                    quality={100}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                                    unoptimized={false}
                                />
                            </div>
                        ))}

                        {/* Image info overlay - only shows if title/description exists */}
                        {(currentImage.title || currentImage.description) && (
                            <div className={`absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 bg-gradient-to-t from-black/60 to-transparent transition-all duration-700 ${
                                isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                            }`}>
                                {currentImage.title && (
                                    <h2 className="text-white text-2xl md:text-4xl font-extralight tracking-[0.15em] mb-3 drop-shadow-lg"
                                        style={{ fontFamily: '"Didot", "Bodoni MT", "Playfair Display", Georgia, serif' }}>
                                        {currentImage.title}
                                    </h2>
                                )}
                                {currentImage.description && (
                                    <p className="text-white/90 text-sm md:text-base font-light tracking-wide max-w-md drop-shadow">
                                        {currentImage.description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Look number - positioned outside the image */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center">
                        <p className="text-rose-400/60 text-[10px] tracking-[0.3em] uppercase">Look</p>
                        <p className="text-slate-700 text-2xl font-extralight"
                           style={{ fontFamily: '"Didot", "Bodoni MT", "Playfair Display", Georgia, serif' }}>
                            {String(currentIndex + 1).padStart(2, '0')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 z-40 px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Progress bar - pink gradient */}
                    <div className="flex items-center gap-2 mb-6 max-w-md mx-auto">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToIndex(index)}
                                className="flex-1 h-1 bg-pink-200/50 rounded-full overflow-hidden group"
                            >
                                <div
                                    className={`h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full transition-all duration-500 ${
                                        index === currentIndex
                                            ? 'w-full'
                                            : index < currentIndex
                                                ? 'w-full opacity-40'
                                                : 'w-0'
                                    }`}
                                    style={{
                                        animation: index === currentIndex && isPlaying ? 'progress 5s linear' : 'none'
                                    }}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Controls row */}
                    <div className="flex items-center justify-center gap-8">
                        <button
                            onClick={() => setIsPlaying(prev => !prev)}
                            className="flex items-center gap-3 text-slate-400 hover:text-pink-500 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-full border border-pink-200 bg-white/50 backdrop-blur-sm flex items-center justify-center group-hover:border-pink-400 group-hover:bg-white transition-colors shadow-sm">
                                {isPlaying ? <Pause size={14} className="text-rose-500" /> : <Play size={14} className="ml-0.5 text-rose-500" />}
                            </div>
                            <span className="text-xs tracking-[0.2em] uppercase hidden sm:inline text-slate-500">
                                {isPlaying ? 'Pause' : 'Play'}
                            </span>
                        </button>

                        <div className="text-slate-400 text-sm tracking-[0.3em]">
                            <span className="text-pink-500 font-medium">{String(currentIndex + 1).padStart(2, '0')}</span>
                            <span className="mx-2 text-pink-200">/</span>
                            <span>{String(images.length).padStart(2, '0')}</span>
                        </div>

                        <Link
                            href="/shop"
                            className="flex items-center gap-3 text-slate-400 hover:text-pink-500 transition-colors group"
                        >
                            <span className="text-xs tracking-[0.2em] uppercase hidden sm:inline text-slate-500">Shop Now</span>
                            <div className="w-10 h-10 rounded-full border border-pink-200 bg-white/50 backdrop-blur-sm flex items-center justify-center group-hover:border-pink-400 group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-rose-500 group-hover:text-white transition-all shadow-sm">
                                <ChevronRight size={14} className="text-rose-500 group-hover:text-white" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Side thumbnails (desktop) - with soft shadows */}
            <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 flex-col gap-3">
                {images.slice(0, 5).map((img, index) => (
                    <button
                        key={img.id}
                        onClick={() => goToIndex(index)}
                        className={`relative w-16 h-20 overflow-hidden rounded-lg transition-all duration-500 shadow-lg ${
                            index === currentIndex
                                ? 'ring-2 ring-pink-400 scale-110 shadow-pink-200'
                                : 'opacity-70 hover:opacity-100 hover:scale-105 shadow-pink-100/50'
                        }`}
                    >
                        <Image
                            src={img.imageUrl}
                            alt=""
                            fill
                            className="object-cover"
                            quality={80}
                        />
                    </button>
                ))}
                {images.length > 5 && (
                    <button
                        onClick={() => setViewMode('grid')}
                        className="w-16 h-20 bg-white/70 backdrop-blur-sm border border-pink-200 rounded-lg flex items-center justify-center text-rose-400 hover:text-pink-600 hover:bg-white transition-all shadow-lg shadow-pink-100/50"
                    >
                        <span className="text-xs font-medium">+{images.length - 5}</span>
                    </button>
                )}
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -30px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(30px, 10px) scale(1.05); }
                }
                .animate-blob {
                    animation: blob 10s infinite ease-in-out;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    )
}

