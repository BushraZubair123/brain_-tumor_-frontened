import { useState } from "react";
import PredictionResult from "../component/PredictionResult";
import FileUpload from "../component/FileUplaod";
import ButtonGradient from "../assets/svg/ButtonGradient";
import Header from "../component/Header";
import Section from "../component/Section";
import Footer from "../component/Footer";

const Prediction = () => {
  const [prediction, setPrediction] = useState(null);

  return (
    <>
      <Header />
      <ButtonGradient />
      <Section id="prediction" className="pt-[8rem]">
        <div className="container flex flex-col md:flex-row gap-6 min-h-[70vh]">
          <FileUpload onPrediction={setPrediction} />
          <PredictionResult prediction={prediction} />
        </div>
      </Section>
      <Footer />
    </>
  );
};

export default Prediction;
