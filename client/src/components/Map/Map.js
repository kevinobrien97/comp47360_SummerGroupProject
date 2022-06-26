import "./Map.css";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";

const center = { lat: 53.3473, lng: -6.2591 };

const Map = () => {
  // below loads google maps script
  const { isLoaded } = useJsApiLoader({
    // on server must create .env.local file in src to store API key
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  });
  if (!isLoaded) return console.log("error loading map");
  return (
    <div className="google-map">
      <GoogleMap
        // to do -- center map on users current location
        center={center}
        zoom={15}
        mapContainerStyle={{ width: "100%", height: "100%" }}
      >{}</GoogleMap>
    </div>
  );
};

export default Map;
