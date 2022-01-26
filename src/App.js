import React, {useState, useEffect} from 'react';
import { CssBaseline, Grid } from '@material-ui/core';
import { getPlacesData, getWeatherData } from './api'

import Header from './component/Header/Header';
import List from './component/List/List';
import Map from './component/Map/Map';
import PlaceDetails from './component/PlaceDetails/PlaceDetails';

const App = () => {

  const [places, setPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [autocomplete, setAutocomplete] = useState(null);
  const [childClicked, setChildClicked] = useState(null);

  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: {latitude, longitude}}) => {
      setCoordinates({lat: latitude, lng: longitude})
    })
  }, []);

  useEffect(() => {
    const filteredPlaces = places.filter((place) => place.rating > rating);

    setFilteredPlaces(filteredPlaces)
  }, [rating]);
  
  

  useEffect(() => {
    if(bounds.sw && bounds.ne){
      setIsLoading(true)

      getWeatherData(coordinates.lat, coordinates.lng)
      .then((data) =>setWeatherData(data))

      getPlacesData(type, bounds.ne, bounds.sw)
      .then((data) => {
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0))
        setFilteredPlaces([])
        setIsLoading(false)
      });
    }

  }, [type, bounds]);

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();

    setCoordinates({ lat, lng });
  };
  

  return (
  <>
    <CssBaseline>
        <Header onPlaceChanged={onPlaceChanged} onLoad={onLoad} />
        <Grid container spacing={3} style={{ width: '100'}}>
            <Grid item xs={12} md={4}>
                <List 
                places={filteredPlaces.length ? filteredPlaces : places}
                childClicked = {childClicked}
                isLoading={isLoading}
                type={type}
                setType={setType}
                rating = {rating}
                setRating= {setRating}
                />
            </Grid>
            <Grid item xs={12} md={8}>
                <Map 
                  setCoordinates={setCoordinates}
                  setBounds={setBounds}
                  coordinates={coordinates}
                  places={filteredPlaces.length ? filteredPlaces : places}
                  setChildClicked={setChildClicked}
                  weatherData = {weatherData}
                />
            </Grid>
        </Grid>
    </CssBaseline>
  </>
)
}

export default App;
