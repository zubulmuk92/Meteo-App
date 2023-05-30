import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Weather from './Weather';

const GeoLoc = () => {
    const [city, setCity] = useState('');

    useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(getCityFromCoordinates);
      } else {
         console.error('La géolocalisation n\'est pas supportée par ce navigateur.');
      }
    };

    const getCityFromCoordinates = async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);

        if (response.status === 200) {
            console.log(response);
            setCity(response.data.address.town);
        } else {
             console.error('Erreur lors de la récupération des données de géolocalisation.');
        }
      } catch (error) {
         console.error('Erreur lors de la récupération des données de géolocalisation.', error);
      }
    };

    getLocation();
    }, []);

    if(!city) {
        return (
            <>
                <h3>Ville à rechercher :</h3>
                <Weather />
            </>
        ); 
    } 
    else {
        return (
            <>
                <h3>Ville à rechercher :</h3>
                <Weather 
                    defaultVille={city}
                />
            </>
        );
    }

};

export default GeoLoc;