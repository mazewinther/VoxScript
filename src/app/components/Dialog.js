import React from 'react';

export default function Dialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg shadow-lg p-5">
        {title && <h1 className="text-black font-bold text-lg">{title}</h1>}
        <p className="mb-4 text-black">{message}</p>
        <div className="flex justify-end">
          <button onClick={onCancel} className="bg-white border-2 hover:bg-gray-100 text-gray-800 py-2 px-4 rounded-lg mr-2">Cancel</button>
          <button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg">Confirm</button>
        </div>
      </div>
    </div>
  );
}