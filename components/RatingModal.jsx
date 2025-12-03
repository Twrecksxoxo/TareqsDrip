'use client'

import { Star } from 'lucide-react';
import React, { useState } from 'react'
import { XIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const RatingModal = ({ ratingModal, setRatingModal }) => {

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    const handleSubmit = async () => {
        if (rating < 0 || rating > 5) {
            return toast('Please select a rating');
        }
        if (review.length < 5) {
            return toast('write a short review');
        }

        setRatingModal(null);
    }

    return (
        <div className='fixed inset-0 z-120 flex items-center justify-center bg-slate-950/80 backdrop-blur-md'>
            <div className='bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl shadow-cyan-500/20 w-96 relative border border-cyan-500/30'>
                <button onClick={() => setRatingModal(null)} className='absolute top-3 right-3 text-cyan-400 hover:text-cyan-200 transition-colors'>
                    <XIcon size={20} />
                </button>
                <h2 className='text-xl font-bold text-cyan-400 mb-4'>Rate Product</h2>
                <div className='flex items-center justify-center mb-6 gap-2'>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            className={`size-8 cursor-pointer transition-all hover:scale-110 ${rating > i ? "text-cyan-400 fill-current drop-shadow-lg drop-shadow-cyan-400/50" : "text-slate-600 hover:text-slate-500"}`}
                            onClick={() => setRating(i + 1)}
                        />
                    ))}
                </div>
                <textarea
                    className='w-full p-3 bg-slate-700/50 border border-cyan-500/30 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-slate-100 placeholder-slate-400 transition-all'
                    placeholder='Write your review (optional)'
                    rows='4'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <button onClick={e => toast.promise(handleSubmit(), { loading: 'Submitting...' })} className='tech-button w-full text-white py-2 rounded-lg hover:scale-105 active:scale-95 transition-all font-bold'>
                    Submit Rating
                </button>
            </div>
        </div>
    )
}

export default RatingModal