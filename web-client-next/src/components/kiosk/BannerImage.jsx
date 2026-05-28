export default function BannerImage({
  src,
  alt = "banner",
  className = "",
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`max-h-96 w-full object-cover mb-5 rounded-xl ${className}`}
    />
  );
}