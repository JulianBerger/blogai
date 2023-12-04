import { createApi } from "unsplash-js";
import { PhotosWithTotalResults, createClient } from "pexels";

const unsplash = createApi({
  accessKey: process.env["UNSPLASH_ACCESS_KEY"] || "",
});

const pexels = createClient(process.env["PEXELS_API_KEY"] || "");

export interface StockImage {
  url: string;
  alt: string;
  title: string;
}

export async function getStockImagesForQueryUnsplash(
  query: string,
  count = 1,
): Promise<StockImage[]> {
  const searchResult = await unsplash.search.getPhotos({ query });

  if (searchResult.response) {
    return searchResult.response.results.slice(0, count).map((result) => {
      return {
        url: result.urls.regular,
        alt: result.alt_description || "",
        title: result.description || "",
      };
    });
  }

  return [];
}

export async function getStockImagesForQueryPexels(
  query: string,
  count = 1,
): Promise<StockImage[]> {
  const searchResult = (await pexels.photos.search({
    query,
  })) as PhotosWithTotalResults;

  if (searchResult?.photos) {
    return searchResult.photos.slice(0, count).map((result) => {
      return {
        url: result.url,
        alt: result.alt || "",
        title: "",
      };
    });
  }

  return [];
}

export async function getStockImagesForQuery(
  query: string,
  count = 1,
  provider: "unsplash" | "pexels" = "pexels",
): Promise<StockImage[]> {
  if (provider === "unsplash") {
    return getStockImagesForQueryUnsplash(query, count);
  } else if (provider === "pexels") {
    return getStockImagesForQueryPexels(query, count);
  }

  return [];
}
