// import "tailwindcss/tailwind.css";
import "tailwindcss/tailwind.css";
import "../style.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className="overflow-y-hidden">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
