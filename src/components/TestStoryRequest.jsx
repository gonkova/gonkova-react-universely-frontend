import { useEffect } from "react";
import { getStoryDetailsById } from "@/services/api";

export default function TestStoryRequest() {
  useEffect(() => {
    const storyId = "s_01986fbf-066e-7e68-86a1-0364c5a74fce";
    const token = localStorage.getItem("accessToken"); // ако вече си логната
    const genres = ["Horror", "Mystery"];

    getStoryDetailsById(storyId, token, genres)
      .then((data) => {
        console.log("✅ Story data:", data);
      })
      .catch((err) => {
        console.error("❌ Error loading story:", err);
      });
  }, []);

  return <p>Провери конзолата (F12)</p>;
}
