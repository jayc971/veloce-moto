'use client'

import { useToastStore } from '@/lib/store/toastStore'
import { X, Check, ShoppingCart } from 'lucide-react'
import Image from 'next/image'

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-primary-800 border border-primary-700 rounded-lg shadow-2xl p-4 animate-slide-in"
        >
          <div className="flex items-start gap-3">
            {/* Success Icon or Product Image */}
            {toast.productImage ? (
              <div className="relative w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={toast.productImage}
                  alt={toast.productName || 'Product'}
                  fill
                  className="object-contain p-1"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingCart className="w-4 h-4 text-green-500" />
                <span className="text-green-500 font-semibold text-sm">Added to Cart</span>
              </div>
              {toast.productName && (
                <p className="text-white text-sm font-medium truncate">
                  {toast.productName}
                </p>
              )}
              <p className="text-gray-400 text-xs mt-1">{toast.message}</p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white transition flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
