import React, { useState } from 'react';
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import AudioPlayer from './AudioPlayer';

export default function FileDrop({ handleFileChange, file, showToast }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (validateFiles(files)) {
      handleFileChange(files);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const validateFiles = (files) => {
    if (files.length === 0) {
      showToast('No file selected', 'error');
      return false;
    }
    if (!files[0].type.startsWith('audio/')) {
      showToast('Invalid file type. Please upload an audio file.', 'error');
      return false;
    }
    return true;
  };

  return (
    <div className="w-full max-w-md rounded-lg flex flex-col items-center">
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
        className={`w-full p-5 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed transition duration-300 ${isDragOver ? 'border-indigo-600 bg-indigo-100 scale-105 shadow-indigo-200' : 'border-gray-300 scale-100 shadow-indigo-100'
          }`}
      >
        <CloudArrowUpIcon
          className={`h-12 w-12 mb-2 transition-colors duration-300 ${isDragOver ? 'text-indigo-600' : 'text-indigo-400'}`}
        />
        <p className={`text-lg font-medium transition-colors duration-300 ${isDragOver ? 'text-indigo-600' : 'text-indigo-400'}`}>
          {isDragOver ? 'Drop files here' : 'Drag and drop files here'}
        </p>
        <p className={`text-sm transition-colors duration-300 ${isDragOver ? 'text-indigo-600' : 'text-indigo-400'}`}>
          or click to browse
        </p>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
          id="fileInput"
        />
      </div>
      <AudioPlayer file={file} />
    </div>
  );
}