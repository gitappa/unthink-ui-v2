export default function BannerImage({
  src,
  alt = "banner",
  className = "",
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`md:max-h-96 max-h-[132px]  w-full object-cover mb-5 rounded-xl ${className}`}
    />
  );
}