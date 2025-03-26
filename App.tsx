'use client'
import { useState, useCallback, useEffect } from "react";
import { useChannel } from "ably/react";
import QRGenerator from "@/components/qr-generator";
import FrameRotation from "./components/svg/frameRotation";
import LogoSienteLaEnergia from "./components/svg/logoSienteLaenergia";

interface AppProps {
  page: number;
  title: string;
}

export default function App(props: AppProps) {
  const [sizes, setSizes] = useState<number[]>([]);
  const [imageArray, setImageArray] = useState<string[]>(
    new Array(40).fill("")
  );
  const [urls, setUrls] = useState<string[]>([]);

  const shuffleArray = (array: string[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  useEffect(() => {
    const dominioUpload = window.location.hostname + "/upload";

    setImageArray(new Array(40).fill(dominioUpload));

    const fetchImages = async () => {
      try {
        const response = await fetch(`/api/files?page=${props.page}&limit=40`);
        const data = await response.json();
        if (data.results.length === 0) setUrls(new Array(40).fill(dominioUpload));

        if (data && Array.isArray(data.results)) {
          const updatedImages = [...new Array(40).fill(dominioUpload)];

          data.results.forEach((imageUrl: string) => {
            const emptyIndex = updatedImages.findIndex((image) => image === "");
            if (emptyIndex !== -1) {
              updatedImages[emptyIndex] = imageUrl;
            }
            setUrls(new Array(39 - emptyIndex).fill(dominioUpload));
          });

          setImageArray(updatedImages);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [props.page]);

  useEffect(() => {
    setSizes(urls.map(() => getRandomArbitrary(0.4, 1) * 128));
  }, [urls]);

  const { channel } = useChannel("photos", "photoUploaded", (message) => {
    handleNewImage(message.data);
    console.log(message.data);
  });

  const handleNewImage = useCallback(
    (imageUrl: string) => {
      const emptyIndex = imageArray.findIndex((image) => image === "");

      console.log(emptyIndex);
      if (emptyIndex !== -1) {
        const newImageArray = [...imageArray];
        newImageArray[emptyIndex] = imageUrl;
        setImageArray(newImageArray);

        deleteQr();
        console.log(sizes.length);
      }
    },
    [imageArray, sizes]
  );

  const deleteQr = () => {
    if (urls.length > 1) {
      const updatedUrls = [...urls];
      updatedUrls.pop();
      setUrls(updatedUrls);

      const updatedSizes = [...sizes];
      updatedSizes.pop();
      setSizes(updatedSizes);
    } else if (urls.length === 1) {
      const updatedUrls: string[] = [];
      const updatedSizes: number[] = [];
      setUrls(updatedUrls);
      setSizes(updatedSizes);
    }
  };

  if (sizes.length === 0 && imageArray.every((image) => image === ""))
    return null;

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      <div
        style={{ pointerEvents: "none" }}
        className="absolute top-0 left-0 w-full h-full z-20 flex justify-center items-center animate-spinScale opacity-80"
      >
        <LogoSienteLaEnergia width="38vw" height="38vw" title={props.title} />
      </div>
      <div
        style={{ pointerEvents: "none" }}
        className="absolute top-0 left-0 w-full h-full z-1 flex justify-center items-center animate-spinScale opacity-90"
      >
        <FrameRotation
          className="animate-spinSlow"
          width="280vw"
          height="280vh"
        />
      </div>

      <div
        className="grid grid-cols-5 grid-rows-8 gap-0 p-0"
        style={{
          gridTemplateRows: "repeat(5, 1fr)",
          gridTemplateColumns: "repeat(8, 1fr)",
          background:
            "radial-gradient(closest-side, #FFFFFF, #FAFAFA, #eaeaea, #DADADA)",
        }}
      >
        {imageArray.map((imageUrl, index) => (
          <div
            key={index}
            className="w-full h-full aspect-square flex items-center justify-center"
          >
            {imageUrl && (
              <img
                src={imageUrl}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover grayscale opacity-40"
              />
            )}
          </div>
        ))}
      </div>

      {/* Renderizar QR solo si hay al menos uno */}
      {urls.length > 0 && (
        <div>
          {urls.map((url, index) => (
            <QRGenerator
              key={index}
              url={url}
              id={`qr-${index}`}
              index={index}
              totalQRs={urls.length}
              size={sizes[index]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const getRandomArbitrary = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};
