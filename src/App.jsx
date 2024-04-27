import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import ErrorDisplay from './components/ErrorDisplay.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [error, setError] = useState();

  const [loading, setLoading] = useState(false);
  const [fetchUserPlacesError, setFetchUserPlacesError] = useState();

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);

      try {
        const response =  await fetch('http://localhost:3000/user-places');
        if (!response.ok) {
          throw new Error('An error occured while fetching your places');
        }
        const data = await response.json();
        setUserPlaces(data.places);
        setLoading(false);
      } catch (error) {
        setFetchUserPlacesError(error);
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {

    // Optimistic updating -> Updating both the local state and backend, eliminates the use of managing a loading state
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    if (!userPlaces.some((place) => place.id === selectedPlace.id)) {
      try {
        let response = await fetch('http://localhost:3000/user-places', {
          method: 'PUT',
          body: JSON.stringify({places: [...userPlaces, selectedPlace] }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        if (!response.ok) {
          throw new Error('Error in updating places');
        }
      } catch(error) {
        setUserPlaces(userPlaces);
        setError(error);
      }
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try {
      let response = await fetch('http://localhost:3000/user-places', {
        method: 'PUT',
        body: JSON.stringify({places: userPlaces.filter((place) => place.id !== selectedPlace.current.id) }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Error in removing place');
      }
    } catch(error) {
      setUserPlaces(userPlaces);
      setError(error);
    }

    setModalIsOpen(false);
  }, [userPlaces]);

  function handleErrorModalClose() {
    setError(null);
  }

  return (
    <>
      <Modal open={error} onClose={handleErrorModalClose}>
        {error && <ErrorDisplay // Modal and its content will always be there in the DOM (in closed state), so we will get an error: reading props of undefined (reading message) initally without this check.
          title='ERROR'
          message={error.message}
          onConfirm={handleErrorModalClose}
        />}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {fetchUserPlacesError && <ErrorDisplay title='ERROR' message={fetchUserPlacesError.message} />}
        {!fetchUserPlacesError && <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          isLoading={loading}
          loadingText={'Fetching your places....'}
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
