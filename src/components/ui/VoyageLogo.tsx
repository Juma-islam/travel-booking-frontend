
import React from 'react';

interface VoyageLogoProps {
  size?: number;
  imageUrl?: string;
}

export default function VoyageLogo({ 
  size = 72, 
  imageUrl = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=400" 
}: VoyageLogoProps) {
  
  return (
    <div 
      className="relative flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-105" 
      style={{ 
        width: size, 
        height: size,
        borderRadius: size * 0.25, // ছবির মতো রাউন্ডেড কর্নার
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* ব্যাকগ্রাউন্ড ইমেজ */}
      <img
        src={imageUrl}
        alt="Travel"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* ছবির ওপর ডার্ক ব্লু থেকে সায়ান গ্রেডিয়েন্ট ওভারলে (আপনার কালার প্যালেট অনুযায়ী) */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{ 
          background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)' 
        }}
      ></div>

      {/* ব্যাকগ্রাউন্ড ডেকোরেশন: ইনার সার্কেল */}
      <div 
        className="absolute border border-white/20 rounded-full"
        style={{ width: '75%', height: '75%' }}
      ></div>

      {/* লোগো আইকন কন্টেইনার */}
      <div className="relative z-10 flex items-center justify-center">
        {/* কাস্টম কম্পাস আইকন (আপনার স্কেচের মতো) */}
        <svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* কম্পাস এর বডি পাত */}
          <path 
            d="M28 14L12 19.5L17.5 21.5L19.5 28L25 22L28 14Z" 
            fill="white" 
            className="drop-shadow-md"
            style={{ opacity: 0.95 }}
          />
          
          {/* ইনার ডট/সার্কেল */}
          <circle 
            cx="20" 
            cy="20" 
            r="11" 
            stroke="rgba(255,255,255,0.4)" 
            strokeWidth="1.5" 
            fill="none" 
          />
        </svg>

        {/* ডানদিকের উপরের সেই সিগনেচার অ্যাম্বার ডট (Amber Grad) */}
        <div 
          className="absolute rounded-full border-2 border-white/60 shadow-sm"
          style={{ 
            width: size * 0.18, 
            height: size * 0.18,
            top: -size * 0.05,
            right: -size * 0.05,
            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' 
          }}
        ></div>
      </div>
    </div>
  );
}