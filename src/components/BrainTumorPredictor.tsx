import React, { useState } from "react";
import { Client } from "@gradio/client";
import brain from "../assets/brain.svg";
import upload from "../assets/upload.svg";
import checkmark from "../assets/checkmark.svg";
import exclamationmark from "../assets/exclamationmark.svg";

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

  const handleRemoveImage = async () => {
    setPreviewUrl(null);
    setImageFile(null);
    setPredictResult(null);
  };

  return (
    <div className="flex flex-col items-center">
      <header className="bg-dark_grey border-b min-w-screen mb-[2rem]">
        <div className="container px-[2rem] flex flex-row items-center">
          <img src={brain} alt="" className="laptop:size-[32px] phone:size-[18px] laptop:mr-[1rem] phone:mr-[0.5rem]"/>
          <h1 className="laptop:text-[32px] phone:text-[16px] font-bold">Brain Tumor Predictor</h1>
        </div>
      </header>

      <div className="flex laptop:flex-row phone:flex-col">
        <div className="flex flex-col gap-[1rem] laptop:mr-[2rem] phone:mb-[2rem] items-center justify-center">

          <label>
            {previewUrl ? <img src={previewUrl} className="laptop:size-[15.5rem] phone:size-[7.75rem] border px-[6rem] py-[3rem]" /> : 
              <div className="laptop:min-w-[420px] laptop:text-[18px] bg-white border-2 border-dashed border-grey rounded-[5px] px-[1rem] py-[6rem] cursor-pointer inset-shadow-[2px,6px,6px,rgba(0,0,0,0.25)] hover:border-light_grey hover:ring-2 hover:ring-grey focus:ring-2 focus:ring-grey text-center justify-center phone:min-w-[250px] phone:text-[9px]">
                <img src={upload} alt="" className="laptop:size-[48px] phone:size-[24px]" />
                <p className="font-[600]">Click to upload your MRI scan here</p>
              </div>
            }
            <input 
              type="file"
              accept="image/*" 
              onChange={handleImageChange} 
              hidden />
          </label>

          {previewUrl && (
            <button
              onClick={handleRemoveImage}
              className="absolute laptop:ml-[24rem] laptop:mb-[23rem] phone:ml-[17rem] phone:mb-[14rem] border rounded-[5px] text-background bg-white laptop:text-[18px] phone:text-[14px] cursor-pointer hover:bg-light_grey laptop:px-[8px] phone:px-[6px]"
            >
              x
            </button>
          )}

          <button 
            onClick={handlePredict} 
            disabled={loading || !imageFile}
            className="laptop:min-w-[460px] phone:min-w-[270px] text-center justify-center laptop:text-[18px] phone:text-[9px] laptop:py-[1rem] phone:py-[0.5rem] border-2 border-dark_grey rounded-[5px] inset-shadow-[2px,6px,6px,rgba(0,0,0,0.25)] hover:border-grey hover:ring-2 hover:ring-dark_grey focus:ring-2 focus:ring-dark_grey cursor-pointer">
            {loading ? "Loading..." : "Analyze MRI Scan"}
          </button>

        </div> 

        <div className="border border-grey laptop:min-w-[450px] laptop:min-h-[300px] phone:min-w-[265px] phone:min-h-[150px] flex flex-row justify-center items-center bg-dark_grey">
          {!predictResult && (
            <div className="laptop:text-[18px] phone:text-[9px]">
              <p>Upload an MRI scan to see prediction results</p>
            </div>
          )}
          {predictResult && (
            <div>
              {JSON.stringify(predictResult[0].label) === '"No Tumor"' ? (
                <div className="flex flex-col justify-center items-center">
                  <img src={checkmark} className="laptop:size-[60px] phone:size-[30px] bg-light_ijo rounded-[60px] laptop:p-[12px] phone:p-[6px]" alt="" />
                  <p className="laptop:text-[28px] phone:text-[14px] text-center text-ijo">{JSON.stringify(predictResult[0].label)} Detected</p>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <img src={exclamationmark} className="laptop:size-[48px] phone:size-[24px] bg-light_red rounded-[60px] laptop:p-[16px] phone:p-[8px]" alt="" />
                  <p className="laptop:text-[28px] phone:text-[14px] text-center text-[red]">{JSON.stringify(predictResult[0].label)} Detected</p>
                </div>
              )} 
            </div>
          )}  
        </div>

      </div>

    </div>
  );
};

export default BrainTumorPredictor;