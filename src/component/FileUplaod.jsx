import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Button from "./Button";
import { predictImage, errorMessage } from "../services/api";

const SCAN_TYPES = ["MRI", "CT"];

const FileUpload = ({ onPrediction }) => {
  const [scanType, setScanType] = useState("MRI");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImage(Object.assign(file, { preview: URL.createObjectURL(file) }));
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    multiple: false,
    onDrop,
    onDropRejected: () => setError("Please upload a JPG or PNG image."),
  });

  const handleRemoveImage = () => {
    if (image?.preview) URL.revokeObjectURL(image.preview);
    setImage(null);
  };

  const handlePredict = async () => {
    if (!image) return;
    setLoading(true);
    setError("");
    try {
      const data = await predictImage(image, scanType);
      onPrediction({ ...data, scan_type: data.scan_type || scanType });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-n-8/80 border border-n-6 rounded-3xl p-4 md:p-6 flex flex-col min-h-[400px]">
      <h2 className="text-2xl font-bold mb-4 text-white">Upload Scan</h2>

      {/* Scan type */}
      <p className="text-sm text-n-3 mb-2">Select scan type</p>
      <div className="flex gap-3 mb-5">
        {SCAN_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setScanType(type)}
            className={`flex-1 h-11 rounded-xl border font-code text-sm font-semibold transition-colors ${
              scanType === type
                ? "border-color-1 bg-color-1/20 text-n-1"
                : "border-n-6 text-n-3 hover:border-n-4"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className="flex-1 flex flex-col items-center justify-center mb-6 border-2 border-dashed border-n-6 rounded-xl p-4 transition-colors hover:border-color-1 cursor-pointer"
      >
        <input {...getInputProps()} />
        {!image ? (
          <div className="text-center">
            <svg className="w-12 h-12 text-n-4 mb-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="font-medium text-white text-sm">Drag & drop your {scanType} scan here</p>
            <p className="text-xs text-n-4 mt-1">or click to browse (JPG / PNG)</p>
          </div>
        ) : (
          <img src={image.preview} alt="Scan preview" className="max-w-full max-h-[250px] rounded-lg object-contain" />
        )}
      </div>

      {image && (
        <div className="mb-4 flex items-center justify-between bg-n-7 rounded-xl p-3">
          <div>
            <p className="text-sm text-white truncate max-w-[200px]">{image.name}</p>
            <p className="text-xs text-n-4">{(image.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Remove
          </button>
        </div>
      )}

      {error && (
        <p className="mb-4 p-3 rounded-xl bg-red-900/40 border border-red-700 text-sm text-red-200">
          {error}
        </p>
      )}

      <Button
        onClick={handlePredict}
        disabled={!image || loading}
        className="w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "ANALYZING..." : `ANALYZE ${scanType} SCAN`}
      </Button>
    </div>
  );
};

export default FileUpload;
