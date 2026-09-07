import React, { useState } from "react";
import Image from "next/image";
import { message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import CopyToClipboard from "react-copy-to-clipboard";
import { RiArrowDropDownLine } from "react-icons/ri";

import facebookIcon from "../../images/staticpageimages/facebookIcon.png";
import instagramIcon from "../../images/staticpageimages/instagramIcon.png";

const ProductBrandDetails = ({ brandsDetails }) => {
  const [dropDown, setDropDown] = useState(false);

  const linkifyText = (description) => {
    const urlRegex = /(?<=\s|^)(https?:\/\/[^\s]+)/g;
    const exactUrlRegex = /^https?:\/\/[^\s]+$/;
    return description.split(urlRegex).map((text, index) => {
      if (exactUrlRegex.test(text)) {
        return (
          <a
            key={`${text}-${index}`}
            href={text}
            target="_blank"
            rel="noreferrer"
            className="px-0 text-blue-109"
          >
            {text}
          </a>
        );
      } else {
        return <span key={`${text}-${index}`}>{text}</span>;
      }
    });
  };

  const hasContactDetails =
    brandsDetails?.title ||
    brandsDetails?.email ||
    brandsDetails?.contact ||
    brandsDetails?.instagramUrl ||
    brandsDetails?.facebookUrl ||
    brandsDetails?.info ||
    brandsDetails?.couponCode ||
    brandsDetails?.paymentDetails ||
    brandsDetails?.shippingDetails;

  return (
    <>
      {brandsDetails?.couponCode ? (
        <div className="">
          <div className="flex flex-col sm:flex-row sm:items-center my-1.5 gap-2 sm:gap-0 text-sm sm:text-base">
            <div className="sm:w-1/4 font-semibold text-[#1f2c3b]">
              Coupon Code
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-[#dccfff] px-3 py-1.5 bg-white">
              <p className="text-sm sm:text-base text-[#1f2c3b]">
                {brandsDetails.couponCode}
              </p>
              <CopyToClipboard
                text={brandsDetails.couponCode}
                onCopy={() => message.success("Copied", 1)}
              >
                <CopyOutlined
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="text-lg cursor-pointer"
                />
              </CopyToClipboard>
            </div>
          </div>
        </div>
      ) : null}

      {hasContactDetails && (
        <div className="mt-6 border-t border-[#e7edf5] pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7edf5] pb-3">
            <div className="flex items-center gap-2">
              <p
                className="text-base sm:text-lg font-semibold cursor-pointer  text-[#182438]"
                onClick={() => setDropDown(!dropDown)}
              >
                Contact Details
              </p>
              {brandsDetails?.shippingDetails ||
                brandsDetails?.paymentDetails ||
                brandsDetails?.info ||
                brandsDetails?.contact ||
                brandsDetails?.email ||
                (brandsDetails?.title && (
                  <RiArrowDropDownLine
                    onClick={() => setDropDown(!dropDown)}
                    className={`h-6 w-6 cursor-pointer text-xl transition-transform ${dropDown ? "rotate-180" : ""}`}
                  />
                ))}
            </div>

            {brandsDetails?.instagramUrl || brandsDetails?.facebookUrl ? (
              <div className="flex items-center gap-2">
                {brandsDetails?.instagramUrl && (
                  <a
                    href={brandsDetails.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d6e0eb] bg-white transition-transform hover:scale-105"
                  >
                    <Image
                      src={instagramIcon}
                      width={18}
                      height={18}
                      alt="Instagram"
                    />
                  </a>
                )}
                {brandsDetails?.facebookUrl && (
                  <a
                    href={brandsDetails.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d6e0eb] bg-white transition-transform hover:scale-105"
                  >
                    <Image
                      src={facebookIcon}
                      width={18}
                      height={18}
                      alt="Facebook"
                    />
                  </a>
                )}
              </div>
            ) : null}
          </div>
          {dropDown && (
            <div className="mt-4 divide-y divide-[#edf2f7]">
              {brandsDetails?.title && (
                <div className="grid grid-cols-1 sm:grid-cols-[170px_minmax(0,1fr)] gap-1 sm:gap-4 py-3 text-sm sm:text-base">
                  <p className="text-[11px] sm:text-base font-semibold uppercase tracking-wide text-[#9F9FA9]">
                    Brand Name
                  </p>
                  <p className="font-medium text-[#1f2c3b] break-words">
                    {brandsDetails.title}
                  </p>
                </div>
              )}

              {brandsDetails?.email && (
                <div className="grid grid-cols-1 sm:grid-cols-[170px_minmax(0,1fr)] gap-1 sm:gap-4 py-3 text-sm sm:text-base">
                  <p className="text-[11px] sm:text-base font-semibold uppercase tracking-wide text-[#9F9FA9]">
                    Brand Email
                  </p>
                  <a
                    className="block p-0 font-medium text-[#334155] break-all hover:underline"
                    href={`mailto:${brandsDetails.email}`}
                  >
                    {brandsDetails.email}
                  </a>
                </div>
              )}

              {brandsDetails?.contact && (
                <div className="grid grid-cols-1 sm:grid-cols-[170px_minmax(0,1fr)] gap-1 sm:gap-4 py-3 text-sm sm:text-base">
                  <p className="text-[11px] sm:text-base font-semibold uppercase tracking-wide text-[#9F9FA9]">
                    Contact
                  </p>
                  <a
                    className="block p-0 font-medium text-[#334155] hover:underline"
                    href={`tel:${brandsDetails.contact}`}
                  >
                    {brandsDetails.contact}
                  </a>
                </div>
              )}
            </div>
          )}

          {brandsDetails?.info && dropDown ? (
            <p className="mt-3 text-sm sm:text-base font-semibold text-[#1f2c3b]">
              {brandsDetails.info}
            </p>
          ) : null}
        </div>
      )}

      {brandsDetails?.paymentDetails && dropDown && (
        <div className="mt-5 lg:mt-8">
          <div className="text-base sm:text-lg font-semibold leading-loose border-b border-solid border-[#e3dcff] text-[#182438]">
            Payment Details
          </div>
          <div className="mt-2 text-sm sm:text-[15px] lg:text-base leading-7 text-[#334155]">
            {linkifyText(brandsDetails.paymentDetails)}
          </div>
        </div>
      )}

      {brandsDetails?.shippingDetails && dropDown && (
        <div className="mt-5 lg:mt-8">
          <div className="text-base sm:text-lg font-semibold leading-loose border-b border-solid border-[#e3dcff] text-[#182438]">
            Shipping Details
          </div>
          <div className="mt-2 text-sm sm:text-[15px] lg:text-base leading-7 text-[#334155]">
            {linkifyText(brandsDetails.shippingDetails)}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductBrandDetails;
