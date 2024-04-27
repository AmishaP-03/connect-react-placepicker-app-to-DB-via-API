import { useEffect, useState } from 'react';
import ErrorDisplay from './ErrorDisplay.jsx';
import Places from './Places.jsx';
import { sortPlacesByDistance } from '../loc.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  // HTTP request to fetch data from the backend API

  // 1st option -> will cause an infinite loop, so not preferred
  // fetch method is provided by the browser

  // fetch('https://localhost:3000/places').then((response) => {
  //   return response.json();
  // }).then((data) => setAvailablePlaces(data.places));

  // 2nd option ->
  // useEffect to solve the infinite loop issue. fetch method will be executed only once when the component is loaded for the first
  // useEffect(() => {
  //     fetch('http://localhost:3000/places').then((response) => {
  //       return response.json();
  //     }).then((data) => setAvailablePlaces(data.places));
  // }, []);

  // 3rd option, most modern ->
  // We cannot use async directly on react specific elements like component functions, callback functions used in react hooks etc
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const response =  await fetch('http://localhost:3000/places');
        if (!response.ok) {
          throw new Error('An error occured while fetching places');
        }

        // Do further steps only once we know that there is no error in response
        const data = await response.json();

        // Sort the places depending upon user's location
        // getCurrentPosition takes some time to execute. When it is done fetching the current location of the user, the callback function passed to it will get executed.
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(data.places, position.coords.latitude, position.coords.longitude);
          setAvailablePlaces(sortedPlaces);
          setLoading(false);
        });
        
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (error) {
    return <ErrorDisplay
      title='ERROR'
      message={error.message}
    />;
  }

  return (
    <Places
      title='Available Places'
      places={availablePlaces}
      isLoading={loading}
      loadingText={'Fetching data....'}
      fallbackText='No places available.'
      onSelectPlace={onSelectPlace}
    />
  );
}
