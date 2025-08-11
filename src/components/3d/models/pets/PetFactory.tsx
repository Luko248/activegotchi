import React from 'react';
import { PetState } from '../../../../types';
import BallPet from './BallPet';

interface PetFactoryProps {
  petState: PetState;
  onPetTap: () => void;
}

/**
 * PetFactory selects the appropriate pet model based on mood and other state factors
 */
const PetFactory: React.FC<PetFactoryProps> = ({ petState, onPetTap }) => {
  // Select the appropriate pet variant based on mood
  return <BallPet petState={petState} onPetTap={onPetTap} />;
};

export default PetFactory;
