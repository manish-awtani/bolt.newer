/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { WebContainer } from "@webcontainer/api";
import React, { useEffect, useState } from "react";

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  // In a real implementation, this would compile and render the preview
  const [url, setUrl] = useState("");

  // async function main() {
  //   const installProcess = await webContainer.spawn("npm", ["install"]);

  //   installProcess.output.pipeTo(
  //     new WritableStream({
  //       write(data) {
  //         console.log(data);
  //       },
  //     })
  //   );

  //   await webContainer.spawn("npm", ["run", "dev"]);

  //   // Wait for `server-ready` event
  //   webContainer.on("server-ready", (port, url) => {
  //     // ...
  //     console.log(url);
  //     console.log(port);
  //     setUrl(url);
  //   });
  // }

  // useEffect(() => {
  //   main();
  // }, []);

  async function startServer() {
    // Install dependencies
    const install = await webContainer.spawn("npm", ["install"]);

    install.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log("[install]", data);
        },
      })
    );

    const exitCode = await install.exit;
    if (exitCode !== 0) {
      console.error("npm install failed");
      return;
    }

    // Start dev server
    const server = await webContainer.spawn("npm", ["run", "dev"]);

    server.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log("[server]", data);
        },
      })
    );

    // Listen for server ready
    webContainer.on("server-ready", (port, url) => {
      console.log("Server Ready at:", url);
      setUrl(url);
    });
  }

  useEffect(() => {
    startServer();
  }, []);
  
  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url && (
        <div className="text-center">
          <p className="mb-2">Loading...</p>
        </div>
      )}
      {url && <iframe width={"100%"} height={"100%"} src={url} />}
    </div>
  );
}
