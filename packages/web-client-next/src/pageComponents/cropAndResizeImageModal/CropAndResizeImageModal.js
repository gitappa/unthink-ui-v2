import React, { useState, useRef, useEffect, useCallback } from "react";
import "react-image-crop/dist/ReactCrop.css";

import Modal from "../../components/modal/Modal";
import CropAndResizeImage from "./CropAndResizeImage";

import styles from "./cropAndResizeImageModal.module.scss";
import { notification } from "antd";
import modalStyles from "../../components/modal/Modal.module.css";
const TO_RADIANS = Math.PI / 180;

const CropAndResizeImageModal = ({
  headerText = "",
  isOpen,
  onClose,
  onSubmit,
  aspect,
  selectedImg,
  ImageFileName,
}) => {
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const hiddenAnchorRef = useRef(null);
  const blobUrlRef = useRef("");
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  console.log("completedCrop", completedCrop);

  const onUploadCropClick = useCallback(async () => {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image size. If you want to size according to what they are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    // ✅ Prevent crop below 600x600
    if (cropWidth < 600 || cropHeight < 600) {
      notification.error({
        message: "Image must be at least 600 x 600 pixels",
        //  description:
        //    error?.response?.data?.message || "Unexpected error occurred",
      });
      return;
    }

    const offscreen = new OffscreenCanvas(cropWidth, cropHeight);
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );

    const originalType = "image/png";

    const blob = await offscreen.convertToBlob({
      type: originalType,
    });

    const originalFileName = ImageFileName;
    const extension = originalType.split("/")[1] || "png";

    const hasExtension = originalFileName.includes(".");
    const fileName = hasExtension
      ? originalFileName
      : `${originalFileName}.${extension}`;

    const file = new File([blob], fileName, { type: blob.type });

    // Call onSubmit with the file
    onSubmit({ blobData: file });
    setCompletedCrop("");

    // if (blobUrlRef.current) {
    // 	URL.revokeObjectURL(blobUrlRef.current);
    // }
    // blobUrlRef.current = URL.createObjectURL(blob);

    // if (hiddenAnchorRef.current) {
    // 	hiddenAnchorRef.current.href = blobUrlRef.current;
    // 	hiddenAnchorRef.current.click();
    // }
  }, [imgRef, previewCanvasRef.current, completedCrop]);

  const canvasPreview = useCallback(
    async (image, canvas, crop, scale = 1, rotate = 0) => {
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      // devicePixelRatio slightly increases sharpness on retina devices at the expense of slightly slower render times and needing to
      // size the image back down if you want to download/upload and be true to the images natural size.
      const pixelRatio = window.devicePixelRatio;
      // const pixelRatio = 1

      canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
      canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = "high";

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;

      const rotateRads = rotate * TO_RADIANS;
      const centerX = image.naturalWidth / 2;
      const centerY = image.naturalHeight / 2;

      ctx.save();

      // 5) Move the crop origin to the canvas origin (0,0)
      ctx.translate(-cropX, -cropY);
      // 4) Move the origin to the center of the original position
      ctx.translate(centerX, centerY);
      // 3) Rotate around the origin
      ctx.rotate(rotateRads);
      // 2) Scale the image
      ctx.scale(scale, scale);
      // 1) Move the center of the image to the origin (0,0)
      ctx.translate(-centerX, -centerY);
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
      );
      ctx.restore();
      // setCompletedCrop("");
    },
    [],
  );

  const useDebounceEffect = (fn, waitTime, deps) => {
    useEffect(() => {
      const t = setTimeout(() => {
        fn.apply(undefined, deps);
      }, waitTime);

      return () => {
        clearTimeout(t);
      };
    }, deps);
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate,
        );
      }
    },
    100,
    [completedCrop, scale, rotate, selectedImg],
  );

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedImg) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImg]);

  return (
    <div
      className={selectedImg ? modalStyles.modalBackdrop : ""}
      style={{
        zIndex: 99,
        pointerEvents: selectedImg ? "auto" : "none",
        position: selectedImg ? "fixed" : "relative",
        inset: selectedImg ? 0 : "auto",
        backgroundColor: selectedImg ? "rgba(17, 24, 39, 0.5)" : "transparent",
        backdropFilter: selectedImg ? "blur(3px)" : "none",
        
      }}
    >
      {/* // <Modal
		// 	isOpen={isOpen}
		// 	onClose={onClose}
		// 	headerText={headerText}
		// 	maskClosable={false}
		// 	contentWrapperSpacingClassName='p-4'
		// 	headerTextSpacingClassName='p-2.5'
		// 	headerTextClassName='text-xl font-medium'
		// 	closeClassName='text-xl'> */}
      <div
        className={` absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ${selectedImg ? "h-ful w-full  " : ""}`}
        onClick={(e) => {
          if (selectedImg) {
            e.stopPropagation();
          }
        }}
        style={{
          pointerEvents: selectedImg ? "auto" : "none",
        }}
      >
        {/* <div>
				<input type='file' accept='image/*' onChange={onSelectFile} />
					<div>
						<label htmlFor='scale-input'>Scale: </label>
						<input
							id='scale-input'
							type='number'
							step='0.1'
							value={scale}
							disabled={!imgSrc}
							onChange={(e) => setScale(Number(e.target.value))}
						/>
					</div>
					<div>
						<label htmlFor='rotate-input'>Rotate: </label>
						<input
							id='rotate-input'
							type='number'
							value={rotate}
							disabled={!imgSrc}
							onChange={(e) =>
								setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
							}
						/>
					</div>
					<div>
						<button onClick={handleToggleAspectClick}>
							Toggle aspect {aspect ? "off" : "on"}
						</button>
					</div>
				</div> */}
        {!!selectedImg && (
          <div className="flex justify-center items-center">
            <CropAndResizeImage
              selectedImg={selectedImg}
              imgRef={imgRef}
              aspect={aspect}
              setCompletedCrop={setCompletedCrop}
            />
          </div>
        )}

        {!!completedCrop ? (
          <>
            <div className="hidden">
              <canvas
                ref={previewCanvasRef}
                style={{
                  border: "1px solid black",
                  objectFit: "contain",
                  width: completedCrop.width,
                  height: completedCrop.height,
                }}
              />
            </div>
            <div>
              {/* <a
								href='#hidden'
								ref={hiddenAnchorRef}
								download
								className='hidden'>
								Hidden download
							</a> */}
            </div>
          </>
        ) : null}
      </div>
      {/* // </Modal> */}
      <div
        className={`flex justify-end gap-2 mt-2 ${!!completedCrop ? "z-50 absolute top-10 right-10" : "hidden"}`}
      >
        <button
          className="rounded-xl text-indigo-100 font-bold text-xs md:text-sm py-2 px-4.5 bg-indigo-600"
          onClick={()=>onClose(setCompletedCrop) }
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl text-indigo-100 font-bold text-xs md:text-sm py-2 px-4.5 bg-indigo-600"
          onClick={onUploadCropClick}
          // disabled={!(completedCrop.height && completedCrop.width)}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default CropAndResizeImageModal;
