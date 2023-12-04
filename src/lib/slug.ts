import * as slugifyModule from "slugify";
export const getSlug = slugifyModule.default.default; // hack since slugify is not a module
