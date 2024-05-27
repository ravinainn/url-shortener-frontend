import { useEffect, useState } from "react";
import { serverUrl } from "../constants/helper";
import axios from "axios";

const Home = () => {
  const [originalURL, setOriginalURL] = useState("");
  const [error, setError] = useState("");
  const [links, setLinks] = useState([]);

  const handleShortenUrl = async (e) => {
    e.preventDefault();
    if (!originalURL) {
      setError("Please enter a valid URL.");
      return;
    }
    try {
      const response = await axios.post(
        `${serverUrl}url/`,
        // "http://localhost:3000/url/",
        { url: originalURL },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const shortId = response.data.shortID;

      setLinks([
        [`http://localhost:3000/url/${shortId}`, originalURL],
        ...links,
      ]);

      setOriginalURL("");
      setError("");
    } catch (error) {
      setError(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverUrl}url/`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = response.data;
        // console.log(data);
        const linksArray = data.map((item) => [
          `https://url-shortener-ravinainn.onrender.com/url/${item.shortID}`,
          item.redirectURL,
        ]);
        setLinks(linksArray);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }
    };

    fetchData(); // Call the async function immediately
  }, [handleShortenUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div>
        <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2">
          URL SHORTENER
        </h1>
        <p className="text-color1 font-semibold text-center mb-24">
          Shorten Your URL in Single Click
        </p>
        <form
          onSubmit={handleShortenUrl}
          className="flex  justify-center items-center "
        >
          <input
            type="text"
            value={originalURL}
            onChange={(e) => setOriginalURL(e.target.value)}
            placeholder="https://your-url.com/"
            className=" md:min-w-64 border bg-transparent border-slate-800 p-2 rounded rounded-e-none focus:outline-none  "
          />
          <button
            type="submit"
            className="border font-semibold text-l bg-slate-100 text-color1 border-slate-800 p-2 rounded rounded-s-none"
          >
            Shorten
          </button>
        </form>
        <ul className="mt-4">
          {links &&
            links.map((link, ind) => (
              <div key={ind} className="border rounded p-2 mb-2">
                <li className="text-blue-500  flex justify-between w-full">
                  <span>{link[1]}</span> :
                  <a href={link[0]} target="_blank" rel="noopener noreferrer">
                    {link[0]}
                  </a>
                </li>
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
