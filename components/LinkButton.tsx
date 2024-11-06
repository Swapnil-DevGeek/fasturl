import Link from "next/link";
import React from "react";

export interface Props { 
    link : String,
    text : String
}

const LinkButton = (props : Props) => {
  return (
    <Link target={`${props.link==="github"? "_blank" : "_self"}`} href={`/${props.link}`}>
      <button
        type="button"
        className="text-white bg-blue-900 hover:bg-blue-800 hover:underline focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-xl text-sm px-4 py-2"
      >
        {props.text}
      </button>
    </Link>
  );
};

export default LinkButton;
