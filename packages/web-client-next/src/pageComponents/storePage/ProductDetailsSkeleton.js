import React from "react";
import styles from './ProductDetails.module.scss'

export const PDPPageSkeleton = () => {
  return (
    <div className="w-full max-w-6xl mx-auto pb-20 lg:pb-12">
      <div className="flex flex-col my-12 gap-5">

        {/* Go back */}
        <div className="flex items-center gap-2">
          <div className={`${styles.skeleton} h-6 w-6`} />
          <div className={`${styles.skeleton} h-6 w-24`} />
        </div>

        <div className="flex flex-col lg:flex-row gap-5">

          {/* Image skeleton */}
          <div className="w-full lg:max-w-439 h-[480px] border rounded-xl p-4">
            <div className={`${styles.skeleton} w-full h-full rounded-xl`} />
          </div>

          {/* Right content */}
          <div className="flex flex-col gap-4 w-full lg:w-[65%]">

            {/* Product title */}
            <div className={`${styles.skeleton} h-7 w-3/4`} />

            {/* Price */}
            <div className="flex gap-3 items-center">
              <div className={`${styles.skeleton} h-6 w-24`} />
              <div className={`${styles.skeleton} h-4 w-16`} />
            </div>

            {/* Availability */}
            <div className={`${styles.skeleton} h-4 w-32`} />

            {/* Buy button */}
            <div className={`${styles.skeleton} h-12 w-40 rounded-lg mt-4`} />

            {/* Brand info */}
            <div className="mt-6 space-y-2">
              <div className={`${styles.skeleton} h-5 w-48`} />
              <div className={`${styles.skeleton} h-4 w-full`} />
              <div className={`${styles.skeleton} h-4 w-5/6`} />
            </div>

            {/* Tags */}
            <div className="flex gap-2 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`${styles.skeleton} h-7 w-20 rounded-full`} />
              ))}
            </div>

            {/* Description */}
            <div className="mt-6 space-y-2">
              <div className={`${styles.skeleton} h-5 w-40`} />
              <div className={`${styles.skeleton} h-4 w-full`} />
              <div className={`${styles.skeleton} h-4 w-11/12`} />
              <div className={`${styles.skeleton} h-4 w-10/12`} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
