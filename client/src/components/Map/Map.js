import "./Map.css";
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

const Map = () => {
    const {} = useLoadScript({
        // on server must create .env.local file in src to store API key 
        googleMapsApiKey: process.env.MAPS_API_KEY, 
    });
    if (!isNotLoaded) return (
        console.log("error loading map")
    );
    return (
        <div className="google-map">
            <GoogleMap
                // to do -- center map on users current location  
                defaultCenter={{lat: 53.33306, lng: 6.24889}} 
                defaultZoom={10} />
        </div>
    ); 
}

export default Map;
