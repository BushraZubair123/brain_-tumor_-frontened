import { useEffect, useState } from "react";
import ButtonGradient from "../assets/svg/ButtonGradient";
import Header from "../component/Header";
import Section from "../component/Section";
import Footer from "../component/Footer";
import Button from "../component/Button";
import { downloadReport, errorMessage, fetchPredictions } from "../services/api";
import { confidencePct, isTumor } from "../utils/result";

const History = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPredictions()
      .then(setItems)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (id) => {
    try {
      await downloadReport(id);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <>
      <Header />
      <ButtonGradient />
      <Section id="history" className="pt-[8rem]">
        <div className="container min-h-[70vh]">
          <h2 className="h3 mb-8">Previous Results</h2>

          {error && (
            <p className="mb-4 p-3 rounded-xl bg-red-900/40 border border-red-700 text-sm text-red-200">{error}</p>
          )}
          {loading && <p className="text-n-3">Loading...</p>}

          {!loading && !error && items.length === 0 && (
            <div className="p-8 bg-n-7/60 border border-n-6 rounded-3xl text-center">
              <p className="text-n-3 mb-4">You have not analyzed any scan yet.</p>
              <Button href="/prediction">Analyze a scan</Button>
            </div>
          )}

          {items.length > 0 && (
            <div className="overflow-x-auto border border-n-6 rounded-3xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-n-7 text-n-3 font-code uppercase text-xs">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Scan</th>
                    <th className="p-4">Result</th>
                    <th className="p-4">Confidence</th>
                    <th className="p-4">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => {
                    const id = p._id ?? p.id;
                    const tumor = isTumor(p);
                    return (
                      <tr key={id} className="border-t border-n-6">
                        <td className="p-4 text-n-2">
                          {p.prediction_date ? new Date(p.prediction_date).toLocaleString() : "-"}
                        </td>
                        <td className="p-4">{p.scan_type || "-"}</td>
                        <td className={`p-4 font-semibold ${tumor ? "text-red-300" : "text-green-300"}`}>
                          {tumor ? "Tumor Detected" : "No Tumor Detected"}
                        </td>
                        <td className="p-4">{confidencePct(p.confidence).toFixed(1)}%</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleDownload(id)}
                            className="text-color-1 hover:underline"
                          >
                            Download PDF
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Section>
      <Footer />
    </>
  );
};

export default History;
