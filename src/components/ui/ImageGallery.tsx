import Image from 'next/image';

type Props = {
  images: { src: string; alt?: string }[];
};

export default function ImageGallery({ images }: Props) {
  if (!images || images.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-3 mt-6">
      {images.map((img, i) => (
        <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-md border border-black/10">
          <Image src={img.src} alt={img.alt || 'Gallery image'} fill sizes="(max-width:768px) 50vw, 33vw" className="object-cover" />
        </div>
      ))}
    </div>
  );
}


