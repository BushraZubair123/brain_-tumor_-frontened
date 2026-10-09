import { useState } from "react";
import Button from "./Button";
import { downloadReport, errorMessage } from "../services/api";
import { confidencePct, isTumor } from "../utils/result";

const PredictionResult = ({ prediction }) => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  if (!prediction) {
    return (
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-white">Result</h2>
        <div className="p-8 bg-n-7/60 border border-n-6 rounded-3xl text-center">
          <p className="text-n-3">No result yet</p>
          <p className="text-sm text-n-4 mt-2">Choose a scan type, upload a scan and press Analyze.</p>
        </div>
      </div>
    );
  }

  const tumor = isTumor(prediction);
  const id = prediction._id ?? prediction.id;

  const handleDownload = async () => {
    setDownloading(true);
    setError("");
    try {
      await downloadReport(id);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2">
      <h2 className="text-2xl font-bold mb-4 text-white">Result</h2>
      <div className={`p-6 rounded-3xl border ${tumor ? "bg-red-900/40 border-red-700" : "bg-green-900/40 border-green-700"}`}>
        <p className={`text-2xl font-bold ${tumor ? "text-red-300" : "text-green-300"}`}>
          {tumor ? "Tumor Detected" : "No Tumor Detected"}
        </p>

        <div className="mt-4 space-y-2 text-sm text-n-2">
          <p>Scan type: <span className="font-medium ml-2">{prediction.scan_type}</span></p>
          <p>Confidence: <span className="font-medium ml-2">{confidencePct(prediction.confidence).toFixed(2)}%</span></p>
          {tumor && prediction.tumor_type && (
            <p>Tumor type: <span className="font-medium ml-2 capitalize">{prediction.tumor_type}</span></p>
          )}
          {prediction.prediction_date && (
            <p>Date: <span className="font-medium ml-2">{new Date(prediction.prediction_date).toLocaleString()}</span></p>
          )}
        </div>

        {tumor && prediction.tumor_info && (
          <p className="mt-4 text-sm text-n-3 leading-relaxed">{prediction.tumor_info}</p>
        )}

        {prediction.class_probabilities && (
          <div className="mt-5 border-t border-n-6 pt-4 space-y-3">
            <p className="text-sm text-n-2 font-medium">Class probabilities</p>
            {Object.entries(prediction.class_probabilities).map(([name, prob]) => (
              <div key={name}>
                <div className="flex justify-between text-xs mb-1.5 text-n-3">
                  <span className="capitalize">{name}</span>
                  <span>{confidencePct(prob).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-n-6 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${name.toLowerCase() === "notumor" ? "bg-green-500" : "bg-color-1"}`}
                    style={{ width: `${confidencePct(prob)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {id && (
          <div className="mt-6">
            <Button onClick={handleDownload} disabled={downloading}>
              {downloading ? "PREPARING..." : "DOWNLOAD PDF REPORT"}
            </Button>
          </div>
        )}
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      </div>

      <p className="mt-4 text-xs text-n-4">
        This result is only a support tool for doctors and radiologists. It does not replace a doctor's diagnosis.
      </p>
    </div>
  );
};

export default PredictionResult;
