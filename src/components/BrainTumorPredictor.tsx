import React, { useState } from "react";
import { Client } from "@gradio/client";

const BrainTumorPredictor: React.FC = () => {
  const [predictResult, setPredictResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
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
    <div style={{ padding: "1rem" }}>
      <h2>Brain Tumor Prediction</h2>

      <div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handlePredict} disabled={loading || !imageFile}>
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