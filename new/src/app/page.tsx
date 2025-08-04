import Image from "next/image";
import "./style-legacy.css";

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <header className="mb-8 flex flex-col items-center">
        <div id="logo-container">
          <Image
            src="/logo-black-small.png"
            alt="Logo"
            width={180}
            height={180}
            priority
          />
        </div>
        <h1 className="text-2xl font-bold mt-4">Excel to TXT Converter</h1>
      </header>

      <main>
        <form id="uploadForm" className="mb-6">
          <div
            id="drop-zone"
            className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center"
          >
            <span id="drop-zone-text">
              Datei hierher ziehen oder klicken, um auszuwählen
            </span>
            <input
              type="file"
              id="fileInput"
              name="file"
              className="hidden"
              accept=".xlsx,.xls"
            />
          </div>
          <button
            id="dnd-button-save"
            type="submit"
            className="mt-4 btn btn-primary w-full"
          >
            Konvertieren & Download
          </button>
        </form>

        <form id="downloadForm" className="mb-4" hidden>
          <button type="submit" className="btn btn-success w-full">
            Download TXT
          </button>
        </form>

        <form id="restartForm" className="mb-4" hidden>
          <button type="button" className="btn btn-secondary w-full">
            Neu starten
          </button>
        </form>
      </main>
    </div>
  );
}
