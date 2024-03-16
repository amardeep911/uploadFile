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
            You can upload whatever type of file you{" "}
            <span className="text-blue-600">need</span>.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Welcome to Uploadsx. We provie a simple and easy way to upload your
            files and share them with others. No need to sign up, just upload
            and share.
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
            title="Fast Delivery"
            description="We assure for the fastest delivery of the product"
          />
          <HeroCars
            image={quality}
            title="Quality Assurance"
            description="We assure for the best quality of the product"
          />
          <HeroCars
            image={support}
            title="24/7 Support"
            description="We assure for the 24/7 support"
          />
        </MaxWidthWrapper>
      </section>
    </>
  );
}
