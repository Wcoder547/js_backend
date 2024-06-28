import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
function App() {
  const [data, setdata] = useState([]);

  useEffect(() => {
    axios
      .get("/api")
      .then((response) => {
        setdata(response.data);
      })
      .catch((err) => {
        console.error("error", err);
      });
  }, []);

  return (
    <>
      {data.map((data, index) => (
        <div
          className="relative h-[400px] w-[300px] rounded-md mb-8"
          key={data.id}
        >
          <img
            src={data.image}
            className="z-0 h-full w-full rounded-md object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-left">
            <h1 className="text-lg font-semibold text-white">{data.title}</h1>
            <p className="mt-2 text-sm text-gray-300">{data.description}</p>
            <button className="mt-2 inline-flex cursor-pointer items-center text-sm font-semibold text-white">
              {data.price}
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export default App;
