import axios from "axios";
import { useState } from "react";
import Image from "./Image.jsx";
import { API_URL } from "../Config";

export default function PhotosUploader({ addedPhotos = [], onChange }) {
  const [photoLink, setPhotoLink] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function addPhotoByLink(e) {
    e.preventDefault();
    if (!photoLink.trim()) {
      alert("Please provide a valid image link.");
      return;
    }

    try {
      setIsUploading(true);
      const { data: filename } = await axios.post(
        `${API_URL}/api/upload-by-link/`,
        { link: photoLink }
      );
      onChange([...addedPhotos, filename]);
      setPhotoLink("");
    } catch (error) {
      console.error("Error uploading photo by link:", error);
      alert("Failed to upload photo by link. Please check the link.");
    } finally {
      setIsUploading(false);
    }
  }

  async function uploadPhoto(e) {
    const files = e.target.files;
    if (!files.length) return;

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    try {
      setIsUploading(true);
      const { data: filenames } = await axios.post(`${API_URL}/api/upload/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange([...addedPhotos, ...filenames]);
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert("Failed to upload photos. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  function removePhoto(e, filename) {
    e.preventDefault();
    const updatedPhotos = addedPhotos.filter((photo) => photo !== filename);
    onChange(updatedPhotos);
  }

  function selectAsMainPhoto(e, filename) {
    e.preventDefault();
    const updatedPhotos = [filename, ...addedPhotos.filter((photo) => photo !== filename)];
    onChange(updatedPhotos);
  }

  return (
    <>
      <div className="flex gap-2 items-center">
        <input
          className="flex-1 px-4 py-1 border rounded-2xl hover:border-primary focus:outline-none"
          value={photoLink}
          onChange={(e) => setPhotoLink(e.target.value)}
          type="text"
          placeholder="Add using a link ....jpg"
        />
        <button
          onClick={addPhotoByLink}
          className="bg-primary text-white px-4 rounded-2xl disabled:opacity-50"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Add Photo"}
        </button>
      </div>

      <div className="mt-3 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.isArray(addedPhotos) &&
          addedPhotos.map((link) => (
            <div key={link} className="h-32 relative flex">
              <Image
                className="rounded-2xl w-full object-cover"
                src={link}
                alt="Uploaded"
              />

              {/* Remove Photo Button */}
              <button
                onClick={(e) => removePhoto(e, link)}
                className="absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-1 px-2"
                aria-label="Remove photo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21M4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916"
                  />
                </svg>
              </button>

              {/* Set Main Photo Button */}
              <button
                onClick={(e) => selectAsMainPhoto(e, link)}
                className="absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-2xl py-1 px-2"
                aria-label="Set as main photo"
              >
                {link === addedPhotos[0] ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007..."
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111..."
                    />
                  </svg>
                )}
              </button>
            </div>
          ))}

        {/* Upload File Input */}
        <label className="h-32 cursor-pointer flex items-center gap-2 justify-center border bg-transparent rounded-2xl p-2 text-xl text-gray-600">
          <input type="file" multiple className="hidden" onChange={uploadPhoto} />
          📁 Upload
        </label>
      </div>
    </>
  );
}
