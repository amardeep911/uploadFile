import Image from "next/image";
import React from "react";

type Props = {
  image: string;
  title: string;
  description: string;
};

const HeroCars = (props: Props) => {
  return (
    <div className="flex flex-col border-red-950 max-w-60 gap-2 justify-center text-center items-center max-h-max">
      <div className="aspect-w-1 aspect-h-1">
        <Image
          src={props.image}
          width={50}
          height={50}
          alt="timer"
          className="object-cover"
        />
      </div>
      <div className="text-black font-semibold">{props.title}</div>
      <div className="text-muted-foreground text-sm">{props.description}</div>
    </div>
  );
};

export default HeroCars;
