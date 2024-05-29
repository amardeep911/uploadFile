import HeroCars from "@/components/Cards/HeroCars";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import timer from "../../public/svg/timer1.svg";
import quality from "../../public/svg/quality.svg";
import support from "../../public/svg/support.svg";
export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-32 mx-auto text-center flex flex-col items-center max-w-6xl">
          <h1 className="text-6xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            You can upload any type of  <span className="text-blue-600">PNG</span> and {" "}
            <span className="text-blue-600">JPEG</span> images.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Welcome to Uploadsx. We provie a simple and easy way to upload your
            images and share them with others. Just signup and start uploading
            images. Can also share the images with others.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link href="/products" className={buttonVariants()}>
            Contact Us
          </Link>
          <Button variant="ghost">
            <Link href="/logIn">Log in </Link> &rarr;
          </Button>
        </div> */}
        </div>
      </MaxWidthWrapper>

      <section className="py-20 bg-gray-100">
        <MaxWidthWrapper className="flex flex-col items-center gap-10 sm:flex-row  md:flex-row justify-between">
          <HeroCars
            image={timer}
            title="From Anywhere"
            description="Upload images from anywhere in the world"
          />
          <HeroCars
            image={quality}
            title="Secure Uploads"
            description="We assure security of your images"
          />
          <HeroCars
            image={support}
            title="24/7 Support"
            description="PNG and JPEG support"
          />
        </MaxWidthWrapper>
      </section>
    </>
  );
}
