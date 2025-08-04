"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import "./style-legacy.css";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [dropText, setDropText] = useState("Drag and Drop");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setDropText(e.dataTransfer.files[0].name);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropText("Datei loslassen zum Hochladen");
  };

  const handleDragLeave = () => {
    setDropText(file ? file.name : "Drag and Drop");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDropText(e.target.files[0].name);
    }
  };

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-teal-700 flex flex-col items-center justify-center">
      {/* Logo Card */}
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8 mb-6 flex flex-col items-center">
        <Image
          src="/logo-black-small.png"
          alt="Logo"
          width={120}
          height={120}
          priority
        />
        <h1 className="text-2xl font-bold mt-4 text-teal-700 text-center">
          Relog Lohn Konverter
        </h1>
      </div>

      {/* Drag and Drop Card */}
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8 mb-6 flex flex-col items-center">
        <div
          id="drop-zone"
          className="w-full h-48 bg-yellow-200 border-2 border-dashed border-teal-400 rounded-lg flex items-center justify-center text-center cursor-pointer text-xl font-bold text-teal-300"
          onClick={handleZoneClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <span id="drop-zone-text">{dropText}</span>
          <input
            type="file"
            id="fileInput"
            name="file"
            className="hidden"
            accept=".xlsx,.xls"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Stepper Card */}
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8 flex flex-col items-center">
        <h2 className="text-xl font-bold text-teal-700 mb-4 text-center">
          Schritt für Schritt
        </h2>
        <div className="flex items-center space-x-4">
          <span className="bg-teal-400 text-white rounded px-3 py-1 font-bold">
            1
          </span>
          <label htmlFor="fileInput" className="font-medium">
            Datei auswählen
          </label>
          <span className="text-gray-500">
            {file ? file.name : "Keine ausgewählt"}
          </span>
        </div>
      </div>
    </div>
  );
}
