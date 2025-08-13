import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

/**
 * Service to export 3D pet models to GLB format for Model Viewer
 */
export class ModelExporterService {
  private exporter: GLTFExporter;

  constructor() {
    this.exporter = new GLTFExporter();
  }

  /**
   * Create a 3D pet model matching the CuteAvatarPet design
   */
  createPetModel(petState: { 
    mood: string; 
    primaryColor?: string; 
    name?: string 
  }): THREE.Group {
    const group = new THREE.Group();
    group.name = 'ActiveGotchiPet';

    // Color processing
    const pastel = (hex: string) => {
      const h = (hex || '#7CC6FF').replace('#', '');
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      const mix = (c: number) => Math.round(c + (255 - c) * 0.4);
      return new THREE.Color(mix(r) / 255, mix(g) / 255, mix(b) / 255);
    };

    const basePrimary = petState.primaryColor || '#7CC6FF';
    const colors = {
      primary: pastel(basePrimary),
      secondary: pastel('#FFB3D9'),
      accent: pastel('#B3FFB3'),
      cheek: new THREE.Color('#FFB6C1'),
      white: new THREE.Color('#FFFFFF'),
      dark: new THREE.Color('#2C2C2C')
    };

    // Create materials
    const primaryMaterial = new THREE.MeshBasicMaterial({ 
      color: colors.primary
    });

    const secondaryMaterial = new THREE.MeshBasicMaterial({
      color: colors.secondary
    });

    const accentMaterial = new THREE.MeshBasicMaterial({
      color: colors.accent
    });

    const whiteMaterial = new THREE.MeshBasicMaterial({
      color: colors.white
    });

    const darkMaterial = new THREE.MeshBasicMaterial({
      color: colors.dark
    });

    // Main body - reduced geometry complexity for mobile
    const bodyGeometry = new THREE.SphereGeometry(1.2, 16, 16);
    const body = new THREE.Mesh(bodyGeometry, primaryMaterial);
    body.position.set(0, 0, 0);
    body.name = 'body';
    body.castShadow = false;
    body.receiveShadow = false;
    group.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.85, 16, 16);
    const head = new THREE.Mesh(headGeometry, primaryMaterial);
    head.position.set(0, 0.8, 0);
    head.name = 'head';
    head.castShadow = false;
    head.receiveShadow = false;
    group.add(head);

    // Eyes - reduced complexity
    const eyeRadius = 0.153;
    const eyeGeometry = new THREE.SphereGeometry(eyeRadius, 8, 8);
    
    const leftEye = new THREE.Mesh(eyeGeometry, whiteMaterial);
    leftEye.position.set(-0.32, 1.04, 0.82);
    leftEye.scale.set(1, 1, 0.12);
    leftEye.name = 'leftEye';
    leftEye.castShadow = false;
    leftEye.receiveShadow = false;
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, whiteMaterial);
    rightEye.position.set(0.32, 1.04, 0.82);
    rightEye.scale.set(1, 1, 0.12);
    rightEye.name = 'rightEye';
    rightEye.castShadow = false;
    rightEye.receiveShadow = false;
    group.add(rightEye);

    // Iris - simplified
    const irisGeometry = new THREE.SphereGeometry(0.085, 8, 8);
    const irisMaterial = new THREE.MeshBasicMaterial({
      color: colors.primary
    });

    const leftIris = new THREE.Mesh(irisGeometry, irisMaterial);
    leftIris.position.set(-0.32, 1.04, 0.9);
    leftIris.scale.set(1, 1, 0.08);
    leftIris.name = 'leftIris';
    group.add(leftIris);

    const rightIris = new THREE.Mesh(irisGeometry, irisMaterial);
    rightIris.position.set(0.32, 1.04, 0.9);
    rightIris.scale.set(1, 1, 0.08);
    rightIris.name = 'rightIris';
    group.add(rightIris);

    // Pupils
    const pupilGeometry = new THREE.SphereGeometry(0.06, 32, 32);
    
    const leftPupil = new THREE.Mesh(pupilGeometry, darkMaterial);
    leftPupil.position.set(-0.32, 1.04, 0.95);
    leftPupil.scale.set(1, 1, 0.06);
    leftPupil.name = 'leftPupil';
    group.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeometry, darkMaterial);
    rightPupil.position.set(0.32, 1.04, 0.95);
    rightPupil.scale.set(1, 1, 0.06);
    rightPupil.name = 'rightPupil';
    group.add(rightPupil);

    // Highlights
    const highlightGeometry = new THREE.SphereGeometry(0.03, 16, 16);
    const highlightMaterial = new THREE.MeshStandardMaterial({
      color: colors.white,
      emissive: colors.white,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.9
    });

    const leftHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    leftHighlight.position.set(-0.29, 1.07, 1.0);
    leftHighlight.scale.set(1, 1, 0.04);
    leftHighlight.name = 'leftHighlight';
    group.add(leftHighlight);

    const rightHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    rightHighlight.position.set(0.35, 1.07, 1.0);
    rightHighlight.scale.set(1, 1, 0.04);
    rightHighlight.name = 'rightHighlight';
    group.add(rightHighlight);

    // Small highlights (flattened)
    const smallHighlightGeometry = new THREE.SphereGeometry(0.02, 16, 16);
    const smallHighlightMaterial = new THREE.MeshStandardMaterial({
      color: colors.white,
      emissive: colors.white,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.7
    });

    const leftSmallHighlight = new THREE.Mesh(smallHighlightGeometry, smallHighlightMaterial);
    leftSmallHighlight.position.set(-0.34, 0.98, 1.001);
    leftSmallHighlight.scale.set(1, 1, 0.1);
    leftSmallHighlight.name = 'leftSmallHighlight';
    group.add(leftSmallHighlight);

    const rightSmallHighlight = new THREE.Mesh(smallHighlightGeometry, smallHighlightMaterial);
    rightSmallHighlight.position.set(0.30, 0.98, 1.001);
    rightSmallHighlight.scale.set(1, 1, 0.1);
    rightSmallHighlight.name = 'rightSmallHighlight';
    group.add(rightSmallHighlight);

    // Mouth
    const mouthGeometry = new THREE.TorusGeometry(0.15, 0.04, 16, 32);
    const mouth = new THREE.Mesh(mouthGeometry, darkMaterial);
    mouth.position.set(0, 0.6, 0.4);
    mouth.name = 'mouth';
    
    // Adjust mouth based on mood
    if (petState.mood === 'happy') {
      mouth.scale.set(1.2, 0.6, 0.3);
    } else if (petState.mood === 'sad') {
      mouth.scale.set(0.8, 0.6, 0.2);
      mouth.rotation.z = Math.PI;
    } else {
      mouth.scale.set(1, 0.4, 0.25);
    }
    
    group.add(mouth);

    // Arms
    const armGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    
    const leftArm = new THREE.Mesh(armGeometry, accentMaterial);
    leftArm.position.set(-1.2, 0.2, 0);
    leftArm.name = 'leftArm';
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, accentMaterial);
    rightArm.position.set(1.2, 0.2, 0);
    rightArm.name = 'rightArm';
    group.add(rightArm);

    // Feet
    const footGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    
    const leftFoot = new THREE.Mesh(footGeometry, secondaryMaterial);
    leftFoot.position.set(-0.5, -1.0, 0.2);
    leftFoot.name = 'leftFoot';
    group.add(leftFoot);

    const rightFoot = new THREE.Mesh(footGeometry, secondaryMaterial);
    rightFoot.position.set(0.5, -1.0, 0.2);
    rightFoot.name = 'rightFoot';
    group.add(rightFoot);

    // Add cheeks if happy
    if (petState.mood === 'happy') {
      const cheekGeometry = new THREE.SphereGeometry(0.08, 32, 32);
      const cheekMaterial = new THREE.MeshStandardMaterial({
        color: colors.cheek,
        transparent: true,
        opacity: 0.6,
        roughness: 0.3
      });

      const leftCheek = new THREE.Mesh(cheekGeometry, cheekMaterial);
      leftCheek.position.set(-0.45, 0.7, 0.3);
      leftCheek.name = 'leftCheek';
      group.add(leftCheek);

      const rightCheek = new THREE.Mesh(cheekGeometry, cheekMaterial);
      rightCheek.position.set(0.45, 0.7, 0.3);
      rightCheek.name = 'rightCheek';
      group.add(rightCheek);
    }

    return group;
  }

  /**
   * Export model to GLB format
   */
  async exportToGLB(model: THREE.Group): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      this.exporter.parse(
        model,
        (result) => {
          if (result instanceof ArrayBuffer) {
            resolve(result);
          } else {
            // Convert to ArrayBuffer if needed
            const json = JSON.stringify(result);
            const buffer = new TextEncoder().encode(json);
            resolve(buffer);
          }
        },
        (error) => {
          reject(error);
        },
        {
          binary: true, // Export as GLB (binary GLTF)
          embedImages: true,
          maxTextureSize: 1024
        }
      );
    });
  }

  /**
   * Generate and download GLB files for all mood states
   */
  async generateAllMoodModels(petState: { primaryColor?: string; name?: string }) {
    const moods = ['happy', 'neutral', 'sad', 'sleepy'];
    
    for (const mood of moods) {
      try {
        console.log(`Generating ${mood} model...`);
        
        const model = this.createPetModel({
          ...petState,
          mood
        });

        const glbBuffer = await this.exportToGLB(model);
        
        // Create download link
        const blob = new Blob([glbBuffer], { type: 'model/gltf-binary' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `activegotchi_pet_${mood}.glb`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        console.log(`${mood} model exported successfully`);
        
        // Small delay between exports
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Failed to export ${mood} model:`, error);
      }
    }
  }

  /**
   * Create animations for the model (for future use)
   */
  createAnimations(_model: THREE.Group): THREE.AnimationClip[] {
    const animations: THREE.AnimationClip[] = [];

    // Idle animation - gentle bobbing
    const idleTracks: THREE.KeyframeTrack[] = [];
    const times = [0, 1, 2];
    
    idleTracks.push(new THREE.VectorKeyframeTrack(
      'head.position',
      times,
      [0, 0.8, 0, 0, 0.9, 0, 0, 0.8, 0]
    ));

    animations.push(new THREE.AnimationClip('idle', 2, idleTracks));

    // Tap animation - quick bounce
    const tapTracks: THREE.KeyframeTrack[] = [];
    const tapTimes = [0, 0.2, 0.4];
    
    tapTracks.push(new THREE.VectorKeyframeTrack(
      '.scale',
      tapTimes,
      [1, 1, 1, 1.15, 1.15, 1.15, 1, 1, 1]
    ));

    animations.push(new THREE.AnimationClip('tap', 0.4, tapTracks));

    // Pirouette animation - spin with jump
    const pirouetteTracks: THREE.KeyframeTrack[] = [];
    const pirouetteTimes = [0, 0.5, 1, 1.5];
    
    pirouetteTracks.push(new THREE.VectorKeyframeTrack(
      '.position',
      pirouetteTimes,
      [0, 0, 0, 0, 1.2, 0, 0, 1.2, 0, 0, 0, 0]
    ));

    pirouetteTracks.push(new THREE.QuaternionKeyframeTrack(
      '.quaternion',
      pirouetteTimes,
      [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    ));

    animations.push(new THREE.AnimationClip('pirouette', 1.5, pirouetteTracks));

    return animations;
  }
}

export default new ModelExporterService();
