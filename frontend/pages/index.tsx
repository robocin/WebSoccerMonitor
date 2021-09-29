import Head from "next/head";
import Home from "./Home";

export default function index() {
  return (
    <div className="h-screen overflow-y-scroll">
      {/* Head */}
      <Head>
        <title>Soccer Web Monitor</title>
      </Head>

      {/* Main Content */}
      <main className="w-full text-2xl text-center">
        <Home />
      </main>
    </div>
  );
}
