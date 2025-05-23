import React, { useState } from "react";
import { Client } from "@gradio/client";

const BrainTumorPredictor: React.FC = () => {
  const [predictResult, setPredictResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
      const url = URL.createObjectURL(e.target.files[0]);
      setPreviewUrl(url)
    }
    };

    const handlePredict = async () => {
    if (!imageFile) return alert("Please upload an image first.");

    setLoading(true);
    try {
      const blob = await imageFile.arrayBuffer();
      const client = await Client.connect("xTorch8/brain-tumor-net");

      const result = await client.predict("/predict", {
        image: new Blob([blob], { type: imageFile.type }),
      });

      const label = result.data;
      setPredictResult(label); 
    } catch (error) {
      console.error("Error in /predict:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <header className="bg-dark_grey border-b min-w-screen mb-[2rem]">
        <div className="container px-[2rem]">
          <h1 className="text-2xl font-bold">Brain Tumor Predictor</h1>
        </div>
      </header>

      <h2>Brain Tumor Prediction</h2>

      <div className="flex flex-col gap-[1rem] items-center justify-center min-w-screen">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange}
          className="text-[18px] bg-grey border-2 border-grey rounded-[5px] pl-[2rem] py-[6rem] cursor-pointer inset-shadow-[2px,6px,6px,rgba(0,0,0,0.25)] hover:border-light_grey hover:ring-2 hover:ring-grey focus:ring-2 focus:ring-grey" />
        
        {previewUrl && (
          <img src={previewUrl} alt="" className="size-[12rem]"/>
        )}

        <button 
          onClick={handlePredict} 
          disabled={loading || !imageFile}
          className="min-w-[380px] text-center justify-center text-[18px] py-[1rem] border-2 border-dark_grey rounded-[5px] inset-shadow-[2px,6px,6px,rgba(0,0,0,0.25)] hover:border-grey hover:ring-2 hover:ring-dark_grey focus:ring-2 focus:ring-dark_grey cursor-pointer">
          {loading ? "Predicting..." : "Predict"}
        </button>
      </div>

      {predictResult && (
        <div>
          <h3>Predict Result:</h3>
          <p>{JSON.stringify(predictResult)}</p>
        </div>
      )}

    </div>
  );
};

export default BrainTumorPredictor;