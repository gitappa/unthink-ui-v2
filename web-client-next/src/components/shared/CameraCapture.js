import React, { useCallback, useEffect, useRef, useState } from "react";
import { notification } from "antd";
import {
  CameraOutlined,
  CloseOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const CameraCapture = ({
  onCapture,
  openButtonLabel = "Camera",
  cancelButtonLabel = "Cancel",
  switchButtonLabel = "Switch Camera",
  switchingButtonLabel = "Switching...",
  captureButtonLabel = "Capture",
  openButtonClassName = "",
  panelClassName = "",
  videoClassName = "",
  actionsClassName = "",
  secondaryButtonClassName = "",
  primaryButtonClassName = "",
  renderIdle,
  renderOpenButton,
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraFacingMode, setCameraFacingMode] = useState("user");
  const videoRef = useRef(null);

  const stopCameraStream = useCallback(() => {
    cameraStream?.getTracks?.().forEach((track) => track.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraStream(null);
  }, [cameraStream]);

  const closeCamera = useCallback(() => {
    stopCameraStream();
    setIsCameraOpen(false);
    setIsCameraStarting(false);
  }, [stopCameraStream]);

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

  const startCamera = async (facingMode = cameraFacingMode) => {
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
      stopCameraStream();

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: { exact: facingMode } },
        });
      } catch (exactModeError) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode },
        });
      }

      setCameraFacingMode(facingMode);
      setCameraStream(stream);
      setIsCameraOpen(true);
    } catch (error) {
      notification.error({
        message: "Camera Access Failed",
        description:
          error?.name === "NotAllowedError"
            ? "Please allow camera permission and try again."
            : "Unable to open the selected camera. Please try another camera.",
      });
    } finally {
      setIsCameraStarting(false);
    }
  };

  const switchCamera = () => {
    startCamera(cameraFacingMode === "user" ? "environment" : "user");
  };

  const captureImage = () => {
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

      closeCamera();
      onCapture?.(file);
    }, "image/jpeg");
  };

  if (isCameraOpen) {
    return (
      <div className={panelClassName}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={videoClassName}
        />
        <div className={actionsClassName}>
          <button
            type="button"
            onClick={closeCamera}
            className={secondaryButtonClassName}
          >
            <CloseOutlined />
            {cancelButtonLabel}
          </button>
          <button
            type="button"
            onClick={switchCamera}
            disabled={isCameraStarting}
            className={secondaryButtonClassName}
          >
            <ReloadOutlined />
            {isCameraStarting ? switchingButtonLabel : switchButtonLabel}
          </button>
          <button
            type="button"
            onClick={captureImage}
            className={primaryButtonClassName}
          >
            <CameraOutlined />
            {captureButtonLabel}
          </button>
        </div>
      </div>
    );
  }

  const openButtonProps = {
    openCamera: () => startCamera(cameraFacingMode),
    isCameraStarting,
    CameraIcon: CameraOutlined,
    LoadingIcon: LoadingOutlined,
  };

  if (renderIdle) {
    return renderIdle(openButtonProps);
  }

  if (renderOpenButton) {
    return renderOpenButton(openButtonProps);
  }

  return (
    <button
      type="button"
      onClick={() => startCamera(cameraFacingMode)}
      disabled={isCameraStarting}
      className={openButtonClassName}
    >
      {isCameraStarting ? <LoadingOutlined /> : <CameraOutlined />}
      {openButtonLabel}
    </button>
  );
};

export default CameraCapture;
