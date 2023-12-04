import { Workflow } from "../interfaces/workflow.ts";
import samplePost from "../content/example-blog-struct-dec01.ts";

const workflow: Workflow = {
  name: "Test Workflow 1",
  website: {
    name: "Wiredinnovator",
    url: new URL("https://wiredinnovator.com/"),
    keywords: ["tech", "reviews", "howto", "tutorials"],
    categories: [
      "Tech",
      "Reviews",
      "How-Tos",
      "Tutorials",
      "Food",
      "Money",
      "Deals",
      "Hacks",
      "AI",
    ],
  },
  samplePost,
  postFileExtension: "mdx",
  postFilePath: "posts/",
  postImageFilePath: "/public/posts/",
  posts: [
    {
      title: "The 11 Best Apps Every College Student Needs To Have",
      postUrl:
        "https://www.makeuseof.com/tag/ten-android-apps-every-college-student-needs/",
    },
    {
      postUrl:
        "https://lifehacker.com/why-your-spotify-wrapped-recap-has-songs-youve-never-li-1840239030",
    },
  ],
};

export default workflow;
