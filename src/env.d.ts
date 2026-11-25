declare namespace App {
  interface Locals {
    /** Ids of the brand logos the rendered document defines; `BrandLogo` refuses any other. */
    brandSprite?: ReadonlySet<string>;
  }
}
