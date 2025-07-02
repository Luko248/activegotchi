import React from 'react';
import { PetState } from '../../../../types';
import BluePet from './BluePet';
import FirePet from './FirePet';

interface PetFactoryProps {
  petState: PetState;
  onPetTap: () => void;
}

/**
 * PetFactory selects the appropriate pet model based on mood and other state factors
 */
const PetFactory: React.FC<PetFactoryProps> = ({ petState, onPetTap }) => {
  // Select the appropriate pet variant based on mood
  const renderPetVariant = () => {
    switch (petState.mood) {
      case 'happy':
        return <FirePet petState={petState} onPetTap={onPetTap} />;
      case 'neutral':
      case 'sad':
      default:
        return <BluePet petState={petState} onPetTap={onPetTap} />;
    }
  };

  return renderPetVariant();
};

export default PetFactory;
