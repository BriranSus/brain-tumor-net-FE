import React, { useState } from "react";
import { Client } from "@gradio/client";
import brain from "../assets/brain.svg";
import upload from "../assets/upload.svg";
import checkmark from "../assets/checkmark.svg";
import exclamationmark from "../assets/exclamationmark.svg";
import testVideo from "../assets/galaxy_brain.mp4";
import Infotab from "../types/Infotab";
import Loading from "../assets/brain_loading.svg";

const BrainTumorPredictor: React.FC = () => {
  const [predictResult, setPredictResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<any>(null);
  const [isActive, setisActive] = useState<Infotab>();

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

  const buttonStyle = ""

  return (
    <main>
      {loading && (
        <div className="min-w-screen min-h-screen fixed inset-0 z-50 flex justify-center items-center">
          <div className="p-6 rounded-lg min-w-screen min-h-screen shadow-lg flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center min-h-screen min-w-screen z-50 bg-darker_grey/75">
              <p className="laptop:text-[28px] phone:text-[21px] font-[600] pb-[16px]">Analyzing MRI...</p>
              <div className="w-[48px] h-[48px] mx-auto flex flex-row justify-center">
                <img src={Loading} alt="Loading..." className="justify-center animate-spin laptop:size-[100px] phone:size-[75px]" />
              </div>  
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="flex flex-col items-center">
        <header className="fixed bg-dark_grey border-b min-w-screen z-1">
          <div className="container px-[2rem] flex flex-row items-center">
            <img src={brain} alt="" className="laptop:size-[32px] phone:size-[18px] laptop:mr-[1rem] phone:mr-[0.5rem]"/>
            <h1 className="laptop:text-[32px] phone:text-[16px] font-bold">Brain Tumor Net</h1>
          </div>
        </header>

        {/* Hero Section */}
        <div className="w-screen bg-background_upload mb-[4rem]">
          <div className="laptop:mt-[8rem] laptop:mb-[4rem] phone:mt-[4rem] phone:mb-[2rem]">
            <div className="laptop:p-[48px] phone:p-[24px] laptop:mx-[64px] phone:mx-[16px] laptop:min-h-[240px] phone:min-h-[120px] bg-light_black">
              <div className="flex laptop:flex-row phone:flex-col laptop:place-content-between">
                <div className="phone:mb-[32px] laptop:mr-[16px]">
                  <h2 className="laptop:text-[36px] phone:text-[20px] laptop:pl-[32px] laptop:mt-[56px]">
                    Early Detection Saves Lives
                  </h2>
                  <p className="laptop:pl-[32px] text-grey laptop:text-[16px] phone:text-[10px]">
                    Our AI-powered tool helps medical professionals quickly <br />screen MRI scans for potential brain tumors, enabling <br /> faster diagnosis and treatment planning.
                  </p>
                  <div>
                    <button
                      className="bg-biru border-none text-[white] rounded-[4px] px-[16px] py-[8px] laptop:ml-[32px] laptop:text-[14px] phone:text-[8px] cursor-pointer hover:bg-darker_biru"
                      onClick={() => document.getElementById("upload_section")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      Try It Now
                    </button>  
                  </div>   
                </div>
                <div className="flex flex-row phone:justify-center laptop:justify-center laptop:items-center laptop:w-2/3 z-0 bg-darker_grey laptop:py-[1rem] laptop:px-[0rem] phone:p-[1rem]">
                  <video src={testVideo} autoPlay muted loop className="laptop:size-8/9 phone:size-full"></video>
                </div>  
              </div>
            </div>
          </div>
        </div>

        {/* Information Section
        <section id="information_section" className="">
          <h2 className="text-center">About Brain Tumors</h2>
          <div className="">
            <div className="w-screen flex flex-row justify-center laptop:place-content-evenly ">
              <button className="">test1</button>
              <button>test2</button>
              <button>test3</button>
              <button>test4</button>
            </div>  
          </div> */}
          
          
        {/* </section> */}

        {/* Upload and Detection Section */}
        <section id="upload_section" className="laptop:mb-[96px] phone:mb-[192px]">
          <h2 className="text-center">Brain Tumor Prediction Tool</h2>
          <div className="flex laptop:flex-row phone:flex-col">
            <div className="flex flex-col gap-[1rem] laptop:mr-[2rem] laptop:mb-[0rem] phone:mb-[2rem] items-center justify-center">

              <label>
                {previewUrl ? <img src={previewUrl} className="laptop:size-[15.5rem] phone:size-[7.75rem] border px-[6rem] py-[3rem]" /> : 
                  <div className="laptop:min-w-[405px] laptop:text-[18px] bg-white border-2 border-dashed border-grey rounded-[5px] px-[1rem] py-[6rem] cursor-pointer inset-shadow-[2px,6px,6px,rgba(0,0,0,0.25)] hover:border-light_grey hover:ring-2 hover:ring-grey focus:ring-2 focus:ring-grey text-center justify-center phone:min-w-[250px] phone:text-[9px]">
                    <img src={upload} alt="" className="laptop:size-[48px] phone:size-[24px]" />
                    <p className="font-[600]">Click to upload your MRI scan here</p>
                  </div>
                }
                <input 
                  type="file"
                  accept="image/*" 
                  disabled={loading}
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
                className="laptop:min-w-[445px] phone:min-w-[320px] text-center justify-center laptop:text-[18px] phone:text-[9px] laptop:py-[1rem] phone:py-[0.5rem] border-2 border-dark_grey rounded-[5px] inset-shadow-[2px,6px,6px,rgba(0,0,0,0.25)] hover:border-grey hover:ring-2 hover:ring-dark_grey focus:ring-2 focus:ring-dark_grey cursor-pointer hover:bg-light_grey">
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
                      <p className="text-center laptop:text-[18px] phone:text-[9px] text-light_grey">While the scan <b>appears normal</b>, <br />please <b>consult a medical professional</b> for verification.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center">
                      <img src={exclamationmark} className="laptop:size-[48px] phone:size-[24px] bg-light_red rounded-[60px] laptop:p-[16px] phone:p-[8px]" alt="" />
                      <p className="laptop:text-[28px] phone:text-[14px] text-center text-[red]">{JSON.stringify(predictResult[0].label)} Detected</p>
                      <p className="text-center laptop:text-[18px] phone:text-[9px] text-light_grey">Please <b>talk to a medical professional</b>, <br />for further evaluation.</p>
                    </div>
                  )} 
                </div>
              )}  
            </div>
          </div>  
        </section>
      </div>
    </main>

    
  );
};

export default BrainTumorPredictor;