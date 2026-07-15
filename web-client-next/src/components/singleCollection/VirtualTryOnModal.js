import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { notification, Upload } from "antd";
import {
  CameraOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Modal from "../modal/Modal";
import { profileAPIs, TryonSaveApiCall, TryOnVto } from "../../helper/serverAPIs";
import { vtoIconState } from "./redux/actions";

const getVTOLoadingSpinnerClass = (hasKioskAccess) =>
  `animate-spin text-5xl ${hasKioskAccess ? "text-kiosk-primary" : "text-indigo-600"}`;

const getVTOCancelButtonClass = (hasKioskAccess) =>
  `cursor-pointer rounded-xl border bg-transparent px-[1.125rem] py-2 text-xs font-bold transition-all duration-300 ease-in-out md:text-sm ${
    hasKioskAccess
      ? "border-kiosk-primary text-black hover:bg-kiosk-secondary/20"
      : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"
  }`;

const getVTOPrimaryButtonClass = (hasKioskAccess) =>
  `cursor-pointer rounded-xl border-0 px-[1.125rem] py-2 text-xs font-bold transition-all duration-300 ease-in-out md:text-sm ${
    hasKioskAccess
      ? "bg-gradient-to-r from-kiosk-primary to-kiosk-secondary text-black hover:from-hover-primary hover:to-hover-kiosk-secondary hover:text-white"
      : "bg-indigo-600 text-white hover:bg-indigo-700"
  }`;

const getVTOTextareaClass = (hasKioskAccess) =>
  `mt-2 w-full resize-none rounded-xl border border-gray-300 px-3 py-2 font-[inherit] text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-[3px] ${
    hasKioskAccess
      ? "focus:border-kiosk-primary focus:ring-kiosk-primary/10"
      : "focus:border-indigo-600 focus:ring-indigo-600/10"
  }`;

const getVTOSubmitButtonClass = (hasKioskAccess, loading) =>
  `mt-5 flex cursor-pointer justify-end rounded-xl border-0 px-[1.125rem] py-2 text-xs font-bold transition-all duration-300 ease-in-out md:text-sm ${
    loading
      ? hasKioskAccess
        ? "bg-kiosk-secondary text-black hover:opacity-90"
        : "bg-indigo-300 text-indigo-600 hover:opacity-90"
      : getVTOPrimaryButtonClass(hasKioskAccess)
  }`;

const VirtualTryOnModal = ({
  isOpen,
  subText,
  hasKioskAccess,
  productImage,
  storeName,
  imageTryonPrompt,
  tryonType = "tryon",
  saveProduct,
  saveUserId = null,
  eventId = null,
  kioskEmail = null,
  kioskUserName = null,
  saveText = "Save",
}) => {
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  const [description, setDescription] = useState("");
  const [vtoResultImageUrl, setVtoResultImageUrl] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);

  const uploadedImage = uploadedImages?.[0];

  useEffect(() => {
    if (!cameraStream || !videoRef.current) return;

    videoRef.current.srcObject = cameraStream;
    videoRef.current.play?.().catch(() => {});
  }, [cameraStream]);

  useEffect(() => {
    return () => {
      cameraStream?.getTracks?.().forEach((track) => track.stop());
    };
  }, [cameraStream]);

  useEffect(() => {
    if (isOpen || !cameraStream) return;

    cameraStream.getTracks?.().forEach((track) => track.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraStream(null);
    setIsCameraOpen(false);
    setIsCameraStarting(false);
  }, [cameraStream, isOpen]);

  if (!isOpen) return null;

  const stopCameraStream = () => {
    cameraStream?.getTracks?.().forEach((track) => track.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraStream(null);
  };

  const handleCloseCamera = () => {
    stopCameraStream();
    setIsCameraOpen(false);
    setIsCameraStarting(false);
  };

  const handleVTOCancel = () => {
    stopCameraStream();
    dispatch(vtoIconState(false));
    setVtoResultImageUrl(null);
    setUploadedImages([]);
    setDescription("");
    setLoading(false);
    setShowLoader(false);
  };

  const handleUploadImage = async ({ file }) => {
    try {
      setShowLoader(true);

      const response = await profileAPIs.uploadImage({ file });
      const data = response?.data;

      if (data?.status_code === 400 || data?.status === "failure") {
        notification.error({
          message: "Image Upload Failed",
          description:
            data?.status_desc || "Something went wrong. Please try again.",
        });
        return;
      }

      const url = data?.data?.[0]?.url;
      if (url) {
        setUploadedImages([url]);
        notification.success({
          message: "Image Uploaded Successfully",
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      notification.error({
        message: "Image Upload Failed",
        description:
          error?.response?.data?.message || "Unexpected error occurred",
      });
    } finally {
      setShowLoader(false);
    }
  };

  const uploadImageDraggerProps = {
    accept: "image/*",
    multiple: false,
    showUploadList: false,
    customRequest: ({ file, onSuccess }) => {
      handleUploadImage({ file });
      setTimeout(() => onSuccess("ok"), 0);
    },
  };

  const handleOpenCamera = async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      notification.error({
        message: "Camera Not Available",
        description: "Your browser does not support camera access.",
      });
      return;
    }

    try {
      setIsCameraStarting(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user" },
      });
      setCameraStream(stream);
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Camera failed:", error);
      notification.error({
        message: "Camera Access Failed",
        description:
          error?.name === "NotAllowedError"
            ? "Please allow camera permission and try again."
            : "Unable to open the camera. Please try again.",
      });
    } finally {
      setIsCameraStarting(false);
    }
  };

  const handleCaptureCameraImage = () => {
    const video = videoRef.current;
    if (!video?.videoWidth || !video?.videoHeight) {
      notification.error({
        message: "Camera Not Ready",
        description: "Please wait for the camera preview to load.",
      });
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      notification.error({
        message: "Capture Failed",
        description: "Unable to prepare the camera image.",
      });
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) {
        notification.error({
          message: "Capture Failed",
          description: "Unable to capture image from the camera.",
        });
        return;
      }

      const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      handleCloseCamera();
      handleUploadImage({ file });
    }, "image/jpeg");
  };

  const handleVTOClick = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    const payload = {
      image_urls: [ uploadedImage,productImage],
      store: storeName,
      image_tryon_prompt: imageTryonPrompt || "",
      additional_prompt: description || "",
      type: tryonType || "tryon",
    };

    try {
      setLoading(true);
      const response = await TryOnVto(payload);
      setVtoResultImageUrl(response?.data?.data?.image_url || null);
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Virtual Try-On Failed",
        description:
          error?.response?.data?.message ||
          "Failed to process image. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVTODownload = async () => {
    if (!vtoResultImageUrl) return;

    try {
      const response = await fetch(vtoResultImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `vto-result-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      notification.success({
        message: "Download Successful",
        description: "Your virtual try-on image has been downloaded.",
      });
      handleVTOCancel();
    } catch (error) {
      console.error("Download failed:", error);
      notification.error({
        message: "Download Failed",
        description: "Failed to download the image. Please try again.",
      });
    }
  };

  const handleVTOSave = async () => {
    if (!saveProduct) return;

    try {
      const payload = {
        collection_type: "vto_collection",
        status: "published",
        collection_name: "my tryons",
        user_id: saveUserId,
        store: storeName,
        event_id: eventId,
        product_lists: [
          {
            mfr_code: saveProduct.mfr_code,
            name: saveProduct.name,
            image: saveProduct.image || "",
          },
          {
            name: "item2",
            image: vtoResultImageUrl || "",
            custom_product: false,
          },
        ],
      };

      const responseData = await TryonSaveApiCall(payload);
      notification.success({
        message: "Save Success",
        description: "Collection added successfully",
      });

    } catch (error) {
      console.log(error);
      notification.error({
        message: "Save Failed",
        description: "Failed to save virtual try-on. Please try again.",
      });
    } finally {
      handleVTOCancel();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      headerText="Virtual Try-On"
      subText={subText}
      onClose={handleVTOCancel}
      size="md"
    >
      {vtoResultImageUrl ? (
        <div className="flex flex-col items-center justify-center py-8">
          <img
            src={vtoResultImageUrl}
            alt="VTO Result"
            className="mb-5 max-h-96 rounded-xl"
          />
          <div className="flex w-full flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={handleVTOCancel}
              className={getVTOCancelButtonClass(hasKioskAccess)}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleVTODownload}
              className={getVTOPrimaryButtonClass(hasKioskAccess)}
            >
              Download
            </button>
            {saveProduct ? (
              <button
                type="button"
                onClick={handleVTOSave}
                className={getVTOPrimaryButtonClass(hasKioskAccess)}
              >
                {saveText}
              </button>
            ) : null}
          </div>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <LoadingOutlined
            className={getVTOLoadingSpinnerClass(hasKioskAccess)}
          />
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="m-0 text-lg font-semibold text-gray-800">
              AI is generating your image
            </p>
            <p className="m-0 text-sm text-gray-500">
              Please wait while we process your request...
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleVTOClick}>
          <div className="relative flex flex-col items-center justify-center pb-[25px]">
            {showLoader ? (
              <LoadingOutlined
                className={getVTOLoadingSpinnerClass(hasKioskAccess)}
              />
            ) : isCameraOpen ? (
              <div className="relative flex w-full flex-col items-center justify-center pb-[25px]">
                <h4 className="mb-3 text-start text-xl font-semibold">
                  Take Your Photo
                </h4>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="max-h-80 w-full max-w-sm rounded-xl bg-black object-cover"
                />
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleCloseCamera}
                    className={getVTOCancelButtonClass(hasKioskAccess)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCaptureCameraImage}
                    className={getVTOPrimaryButtonClass(hasKioskAccess)}
                  >
                    Capture
                  </button>
                </div>
              </div>
            ) : !uploadedImage ? (
              <div className="relative flex flex-col items-center justify-center pb-[25px]">
                <h4 className="mb-3 text-start text-xl font-semibold">
                  Upload Your Image
                </h4>
                <Upload.Dragger
                  className={`h-56 w-56 bg-transparent ${
                    hasKioskAccess
                      ? "[&_.ant-upload-drag:hover]:border-kiosk-primary"
                      : ""
                  }`}
                  {...uploadImageDraggerProps}
                  name="upload_image"
                  showUploadList={false}
                >
                  <p
                    className={`text-[2rem] ${
                      hasKioskAccess ? "text-kiosk-primary" : "text-indigo-600"
                    }`}
                  >
                    <UploadOutlined />
                  </p>
                  <p className="mx-auto w-2/3">
                    Click or drag file(s) to this area
                  </p>
                </Upload.Dragger>
                <button
                  type="button"
                  onClick={handleOpenCamera}
                  disabled={isCameraStarting}
                  className={`mt-3 flex cursor-pointer items-center gap-2 rounded-xl border px-[1.125rem] py-2 text-xs font-bold transition-all duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-70 md:text-sm ${
                    hasKioskAccess
                      ? "border-kiosk-primary bg-transparent text-black hover:bg-kiosk-secondary/20"
                      : "border-indigo-600 bg-transparent text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  {isCameraStarting ? <LoadingOutlined /> : <CameraOutlined />}
                  Camera
                </button>
              </div>
            ) : null}

            {uploadedImage ? (
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="mt-2 max-h-40"
                />
                <CloseCircleOutlined
                  className="absolute right-0 top-2 cursor-pointer text-xl text-white transition-all duration-300 ease-in-out hover:opacity-80"
                  onClick={() => setUploadedImages([])}
                />
              </div>
            ) : null}
          </div>

          <h4 className="font-semibold text-gray-800">
            Add a prompt for AI (optional)
          </h4>
          <textarea
            className={getVTOTextareaClass(hasKioskAccess)}
            placeholder="Enter description..."
            name="description"
            type="text"
            onChange={(event) => setDescription(event.target.value)}
            value={description}
            rows={5}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className={getVTOSubmitButtonClass(hasKioskAccess, loading)}
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default VirtualTryOnModal;
