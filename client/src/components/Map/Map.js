import "./Map.css";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";

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
        // can remove any default controls - should not need these for our app
        options={{ fullscreenControl: false, streetViewControl: false }}
      >
          {/* will need a variant of the below later */}
          {/* <Marker position={center}></Marker> */}
        {}
      </GoogleMap>
    </div>
  );
};

export default Map;
