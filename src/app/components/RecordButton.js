import React, { useState, useRef } from 'react';
import { MicrophoneIcon } from "@heroicons/react/24/solid";
import Dialog from './Dialog';
import lamejs from 'lamejs';

export default function RecordButton({ file, handleFileChange }) {
  const [isRecording, setIsRecording] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const recorder = useRef(null);
  const audioStream = useRef(null);

  const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          audioStream.current = stream;

          const options = { mimeType: 'audio/webm' };
          recorder.current = new MediaRecorder(stream, options);

          const chunks = [];
          recorder.current.ondataavailable = (e) => chunks.push(e.data);
          recorder.current.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            const newFile = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
            handleFileChange({ 0: newFile, length: 1 }, true);

            if (audioStream.current) {
              audioStream.current.getTracks().forEach(track => track.stop());
              audioStream.current = null;
            }
          };

          recorder.current.start();
          setIsRecording(true);
        })
        .catch((error) => {
          console.error("Error accessing media devices.", error);
        });
    } else {
      console.error("MediaDevices interface not available.");
    }
  };

  const stopRecording = () => {
    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleRecordAudio = () => {
    if (isRecording) {
      stopRecording();
    } else {
      if (file) {
        setShowDialog(true);
      } else {
        startRecording();
      }
    }
  };

  const handleConfirm = () => {
    setShowDialog(false);
    startRecording();
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  return (
    <div>
      <div className="mb-6 w-full max-w-md flex justify-center">
        <button
          onClick={handleRecordAudio}
          className={`${isRecording ? 'bg-red-600' : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-md hover:shadow-indigo-200'
            } text-white py-3 px-6 pl-5 rounded-full flex items-center transition duration-300`}
        >
          <MicrophoneIcon className="h-6 mr-2" />
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      {showDialog && <Dialog title="Replace Existing File" message="Are you sure you want to replace the existing file?" onConfirm={handleConfirm} onCancel={handleCancel} />}
    </div>
  );
}