import Head from "next/head";
import Home from "./Home";

export default function index() {
  return (
    <div className="bg-red-300 h-screen overflow-y-scroll scrollbar-hide">
      {/* Head */}
      <Head>
        <title>Next.js Template</title>
      </Head>

      {/* Page Top */}
      <footer className="bg-blue-300 flex items-center justify-center w-full h-12">
        <span>Next.js, Typescript and Tailwindcss Template - By</span>
        <a href="https://mateusfbsoares.com/" className="pl-1 underline">
          Mateus Soares
        </a>
      </footer>

      {/* Main Content */}
      <main className="bg-blue-200 w-full text-2xl text-center">
        <Home />
      </main>

      {/* Footer */}
      <footer className="bg-blue-300 flex items-center justify-center w-full h-12">
        <span>Next.js, Typescript and Tailwindcss Template - By</span>
        <a href="https://mateusfbsoares.com/" className="pl-1 underline">
          Mateus Soares
        </a>
      </footer>
    </div>
  );
}
