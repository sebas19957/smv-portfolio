"use client";
import { customCursor } from "@/lib/utils";
import { Fragment, useEffect } from "react";

const Cursor = () => {
  useEffect(() => {
    customCursor();
  }, []);
  return (
    <Fragment>
      <div className="mouse-cursor cursor-outer" />
      <div className="mouse-cursor cursor-inner" />
    </Fragment>
  );
};

export default Cursor;
