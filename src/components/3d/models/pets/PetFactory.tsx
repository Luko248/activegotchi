import React, { useMemo } from 'react';
import { PetState } from '../../../../types';
import BallPet from './BallPet';
import CuteAvatarPet from './CuteAvatarPet';

interface PetFactoryProps {
  petState: PetState;
  onPetTap: () => void;
  showPirouette?: boolean;
}

/**
 * PetFactory selects the appropriate pet model based on mood and other state factors
 */
const PetFactory: React.FC<PetFactoryProps> = ({ petState, onPetTap, showPirouette = false }) => {
  // Use the new cute avatar by default, with fallback to ball pet
  const PetComponent = useMemo(() => {
    // Check if we have color information - if so, use the cute avatar
    if (petState.primaryColor) {
      return CuteAvatarPet;
    }
    
    // Fallback to ball pet for compatibility
    return BallPet;
  }, [petState.primaryColor]);

  return <PetComponent petState={petState} onPetTap={onPetTap} showPirouette={showPirouette} />;
};

export default PetFactory;
