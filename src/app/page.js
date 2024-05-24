"use client"

import React, { useState } from 'react';
import RecordButton from './components/RecordButton';
import FileDrop from './components/FileDrop';
import Dialog from './components/Dialog';
import Toast from './components/Toast';

export default function Home() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [showFileDialog, setShowFileDialog] = useState(false); // Separate dialog state for file upload
  const [pendingFile, setPendingFile] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });

  const handleFileChange = (files, fromRecording = false) => {
    console.log('New file:', files[0]); // Log the new file details
    if (file && !fromRecording) {
      setPendingFile(files[0]);
      setShowFileDialog(true); // Show dialog for file upload
    } else {
      setFile(files[0]);
      showToast('File added successfully', 'success');
    }
  };

  const handleConfirm = () => {
    setFile(pendingFile);
    setPendingFile(null);
    setShowFileDialog(false); // Close dialog after confirming file upload
    showToast('File replaced successfully', 'success');
  };

  const handleCancel = () => {
    setPendingFile(null);
    setShowFileDialog(false); // Close dialog if file upload is canceled
  };

  const handleUpload = async () => {
    // Upload logic...
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({ message: '', type: '' });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-indigo-600 to-cyan-400 text-transparent bg-clip-text">
        VoxScript AI
      </h1>
      <p className="w-full max-w-md text-gray-500 mb-4 text-center">
        Convert speech into <strong>formatted text</strong> with lists, bolding, and headings. Refine with AI.
      </p>
      <RecordButton file={file} handleFileChange={(files) => handleFileChange(files, true)} />
      <FileDrop handleFileChange={handleFileChange} file={file} showToast={showToast} />
      {file && (
        <button
          onClick={handleUpload}
          className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Transcribe
        </button>
      )}
      {progress > 0 && (
        <div className="w-full max-w-md bg-gray-200 rounded-full mt-4">
          <div
            className="bg-indigo-600 text-xs font-medium text-purple-100 text-center p-0.5 leading-none rounded-full"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}
      {message && <p className="mt-4 text-gray-700 text-center">{message}</p>}
      {showFileDialog && <Dialog title="Replace Existing File" message="Are you sure you want to replace the existing file?" onConfirm={handleConfirm} onCancel={handleCancel} />}
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}