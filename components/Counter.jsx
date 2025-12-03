'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Counter = ({ productId }) => {

    const { cartItems } = useSelector(state => state.cart);

    const dispatch = useDispatch();

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }))
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }))
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-cyan-500/50 bg-slate-800/50 backdrop-blur-sm max-sm:text-sm text-cyan-300 hover:border-cyan-400/70 transition-all">
            <button onClick={removeFromCartHandler} className="p-1 select-none hover:text-cyan-100 hover:scale-110 transition-all font-bold">−</button>
            <p className="p-1 font-medium text-cyan-400 min-w-6 text-center">{cartItems[productId]}</p>
            <button onClick={addToCartHandler} className="p-1 select-none hover:text-cyan-100 hover:scale-110 transition-all font-bold">+</button>
        </div>
    )
}

export default Counter