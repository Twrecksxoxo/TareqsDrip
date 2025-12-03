'use client'
import { XIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"

const AddressModal = ({ setShowAddressModal }) => {

    const [address, setAddress] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: ''
    })

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setShowAddressModal(false)
    }

    return (
        <form onSubmit={e => toast.promise(handleSubmit(e), { loading: 'Adding Address...' })} className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md h-screen flex items-center justify-center">
            <div className="flex flex-col gap-5 text-slate-200 w-full max-w-sm mx-6 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-pink-500/30 shadow-2xl shadow-pink-500/20">
                <h2 className="text-3xl text-pink-400">Add New <span className="font-bold text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text">Address</span></h2>
                <input name="name" onChange={handleAddressChange} value={address.name} className="tech-input p-2 px-4" type="text" placeholder="Enter your name" required />
                <input name="email" onChange={handleAddressChange} value={address.email} className="tech-input p-2 px-4" type="email" placeholder="Email address" required />
                <input name="street" onChange={handleAddressChange} value={address.street} className="tech-input p-2 px-4" type="text" placeholder="Street" required />
                <div className="flex gap-4">
                    <input name="city" onChange={handleAddressChange} value={address.city} className="tech-input p-2 px-4 flex-1" type="text" placeholder="City" required />
                    <input name="state" onChange={handleAddressChange} value={address.state} className="tech-input p-2 px-4 flex-1" type="text" placeholder="State" required />
                </div>
                <div className="flex gap-4">
                    <input name="zip" onChange={handleAddressChange} value={address.zip} className="tech-input p-2 px-4 flex-1" type="number" placeholder="Zip code" required />
                    <input name="country" onChange={handleAddressChange} value={address.country} className="tech-input p-2 px-4 flex-1" type="text" placeholder="Country" required />
                </div>
                <input name="phone" onChange={handleAddressChange} value={address.phone} className="tech-input p-2 px-4" type="text" placeholder="Phone" required />
                <button className="tech-button text-white text-sm font-bold py-2.5 rounded-md hover:scale-105 active:scale-95 transition-all mt-2">SAVE ADDRESS</button>
            </div>
            <XIcon size={30} className="absolute top-5 right-5 text-pink-400 hover:text-pink-200 cursor-pointer transition-colors" onClick={() => setShowAddressModal(false)} />
        </form>
    )
}

export default AddressModal