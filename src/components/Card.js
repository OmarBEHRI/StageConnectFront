import React from 'react';
import Image from 'next/image';

const Card = ({ image, title, specifications, buttons }) => {
  const getButtonColor = (label) => {
    const lowerLabel = label.toLowerCase();
    if (['validate', 'accept', 'apply'].includes(lowerLabel)) return 'bg-green-500 hover:bg-green-600';
    if (['refuse', 'reject'].includes(lowerLabel)) return 'bg-gray-500 hover:bg-gray-600';
    if (lowerLabel === 'pending') return 'bg-orange-500 hover:bg-orange-600';
    return 'bg-blue-500 hover:bg-blue-600'; // Default color
  };

  return (
    <div className="w-full aspect-w-5 aspect-h-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full h-full flex flex-col">
        <div className="flex items-center mb-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image 
              src={image} 
              alt={title} 
              fill
              className="rounded-full object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold ml-4 line-clamp-2">{title}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6 flex-grow">
          {specifications.map((spec, index) => (
            <div key={index} className="flex flex-col">
              <span className="font-medium text-sm text-gray-600 mb-1">{spec.label}</span>
              {spec.isLink ? (
                <a href={spec.value} className="text-blue-500 hover:underline text-sm truncate">
                  {spec.value}
                </a>
              ) : (
                <span className="text-sm truncate">{spec.value}</span>
              )}
            </div>
          ))}
        </div>
        {buttons && buttons.length > 0 && (
          <div className="flex justify-center space-x-4 mt-auto">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`${getButtonColor(button.label)} text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out`}
              >
                {button.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;