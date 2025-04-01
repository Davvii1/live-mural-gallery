"use client";

import { useRouter } from "next/navigation";
import App from "@/App";
import { logos } from "@/components/enums/logos";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { useEffect, useState } from "react";

export default function dashboard() {
  const [page, setPage] = useState(1);
  const [fadeOut, setFadeOut] = useState(false);
  const [autoPagination, setAutoPagination] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [ablyClient, setAblyClient] = useState<Ably.Realtime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSping, setIsSping] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined = undefined;

    try {
      console.log("Initializing Ably client...");

      const client = new Ably.Realtime({
        authUrl: "api/token",
        authParams: {
          ttl: (30 * 60 * 1000).toString(),
        },
        clientId: "live-gallery-mural",
      });

      client.connection.on("connected", () => {
        console.log("Connected to Ably");
        setAblyClient(client);
        setIsLoading(false);
      });

      client.connection.on("disconnected", () => {
        console.log("Disconnected from Ably");
      });

      client.connection.on("failed", (err) => {
        console.error("Ably connection failed:", err);

        setAblyClient(client);
        setIsLoading(false);
      });

      timeoutId = setTimeout(() => {
        console.log("Ably connection timeout - proceeding anyway");
        setAblyClient(client);
        setIsLoading(false);
      }, 5000);

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (client) {
          console.log("Closing Ably connection");
          client.close();
        }
      };
    } catch (error) {
      console.error("Error initializing Ably:", error);
      setIsLoading(false);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }, []);

  const changePage = (nextPage: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setFadeOut(true);

    setTimeout(() => {
      setPage(nextPage);
      setFadeOut(false);
      setIsTransitioning(false);
    }, 500);
  };

  const toggleAutoPagination = () => {
    setAutoPagination((prev) => !prev);
  };

  useEffect(() => {
    if (!autoPagination) return;

    const intervalId = setInterval(() => {
      setFadeOut(true);
      setTimeout(() => {
        setPage((prevPage) => {
          const newPage = prevPage === 3 ? 1 : prevPage + 1;
          return newPage;
        });
        setFadeOut(false);
      }, 500);
    }, 12000);

    return () => clearInterval(intervalId);
  }, [autoPagination]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        changePage(page === 3 ? 1 : page + 1);
      } else if (event.key === "ArrowLeft") {
        changePage(page === 1 ? 3 : page - 1);
      } else if (event.key === "Enter") {
        toggleAutoPagination();
      }
      if (event.key === "a") {
        setIsSping((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [page, autoPagination, isTransitioning]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="mb-2">Loading Ably connection...</p>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {ablyClient ? (
        <AblyProvider client={ablyClient}>
          <ChannelProvider channelName="photos">
            <div className="relative">
              <div className={`transition-all ${fadeOut ? "opacity-0" : ""}`}>
                <App
                  page={page - 1}
                  title={
                    page === 1 ? logos.v1 : page === 2 ? logos.v2 : logos.v3
                  }
                  isSping={isSping}
                />
              </div>
            </div>
          </ChannelProvider>
        </AblyProvider>
      ) : (
        <div>
          {page}
          <div className="relative">
            <div className={`transition-all ${fadeOut ? "opacity-0" : ""}`}>
              <App
                page={page - 1}
                title={page === 1 ? logos.v1 : page === 2 ? logos.v2 : logos.v3}
                isSping={isSping}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
