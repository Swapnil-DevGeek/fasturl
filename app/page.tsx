import LinkButton from "@/components/LinkButton";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row md:mx-auto md:w-[80%] gap-4 items-center justify-center min-h-screen">
      {/* Left Section: Text Content */}
      <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0">
        <h1 className="text-4xl font-bold mb-2">FastURL</h1>
        <p className="text-lg text-gray-400 mb-8">Fast. Simple. Secure.</p>

        {/* Benefits */}
        <div className="max-w-md">
          <p className="text-base mb-4">
            <strong>No Sign-Up Needed:</strong> Start shortening links instantly!
          </p>
          <p className="text-base mb-4">
            <strong>Fast and Free:</strong> Get a shortened URL in one click.
          </p>
          <p className="text-base mb-4">
            <strong>Shareable:</strong> Easily copy and share your link.
          </p>
        </div>

        <LinkButton link={"shorten"} text={"Get Started"} />

      </div>

      {/* Right Section: Image */}
      <div className="md:w-2/3 w-full flex justify-center">
        <Image height={650} width={300} src="/fasturl.webp" alt="FastURL Graphic" className="w-[65%] rounded-xl" />
      </div>
    </div>
  );
}
