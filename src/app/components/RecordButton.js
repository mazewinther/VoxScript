import React, { useState, useRef } from 'react';
import { MicrophoneIcon } from "@heroicons/react/24/solid";
import Dialog from './Dialog';
import lamejs from 'lamejs';
import { OpusDecoder } from 'opus-decoder';

export default function RecordButton({ file, handleFileChange }) {
  const [isRecording, setIsRecording] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const recorder = useRef(null);
  const audioStream = useRef(null); 

  const decodeWebmToPcm = (webmBlob) => {
    return new Promise((resolve, reject) => {
      const decoder = new OpusDecoder(); // Create a decoder instance
      decoder.decode(webmBlob, (data, err) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.channelData);
        }
      });
    });
  };

const encodeToMp3 = async (wavBlob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const mp3Encoder = new lamejs.Mp3Encoder(1, 44100, 128); // Assuming 44100 Hz
      const mp3Data = mp3Encoder.encodeBuffer(e.target.result); 
      const mp3Blob = new Blob([mp3Data], { type: 'audio/mp3' });
      resolve(mp3Blob);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(wavBlob); 
  });
};

// Function to encode PCM data to MP3 using lamejs
const encodePcmToMp3 = async (pcmData, sampleRate) => {
  const mp3Encoder = new lamejs.Mp3Encoder(1, sampleRate, 128); 
  const mp3Data = mp3Encoder.encodeBuffer(new Float32Array(pcmData)); 
  const mp3Blob = new Blob([mp3Data], { type: 'audio/mp3' });
  return mp3Blob;
};

const startRecording = () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        audioStream.current = stream;

        // Record directly to MP3
        const options = { mimeType: 'audio/webm;codecs=opus' }; 
        recorder.current = new MediaRecorder(stream, options);

        const chunks = [];
        recorder.current.ondataavailable = (e) => chunks.push(e.data);
        recorder.current.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/mp3' });
          const newFile = new File([blob], `recording-${Date.now()}.mp3`, { type: 'audio/mp3' });
          handleFileChange({ 0: newFile, length: 1 }, true); 

          // Stop the audio stream 
          if (audioStream.current) { 
            audioStream.current.getTracks().forEach(track => track.stop());
            audioStream.current = null;
          }
        };

        recorder.current.start();
        setIsRecording(true);
      })
      .catch(console.error);
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