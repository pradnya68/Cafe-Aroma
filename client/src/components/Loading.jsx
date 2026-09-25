import React from 'react';
import { Coffee } from 'lucide-react';

const Loading = ({ message = 'Brewing fresh details...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative mb-4">
        <div className="w-14 h-14 rounded-full border-2 border-caramel/30 border-t-gold animate-spin"></div>
        <Coffee className="w-6 h-6 text-gold absolute inset-0 m-auto animate-pulse" />
      </div>
      <p className="font-display italic text-coffee text-lg">{message}</p>
    </div>
  );
};

export default Loading;
