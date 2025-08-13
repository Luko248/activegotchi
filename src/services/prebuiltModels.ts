import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

/**
 * Pre-built GLB models service - generates models once and stores them
 */
export class PrebuiltModelsService {
  private static instance: PrebuiltModelsService;
  private exporter: GLTFExporter;
  private modelCache: Map<string, string> = new Map();

  private constructor() {
    this.exporter = new GLTFExporter();
  }

  static getInstance(): PrebuiltModelsService {
    if (!PrebuiltModelsService.instance) {
      PrebuiltModelsService.instance = new PrebuiltModelsService();
    }
    return PrebuiltModelsService.instance;
  }

  /**
   * Create exact copy of CuteAvatarPet for AR
   */
  private createExactPetModel(mood: string, primaryColor: string = '#7CC6FF'): THREE.Group {
    const group = new THREE.Group();
    group.name = `ActiveGotchi_${mood}`;

    // Convert hex color to pastel (exact same as CuteAvatarPet)
    const pastel = (hex: string) => {
      const h = (hex || '#7CC6FF').replace('#','')
      const r = parseInt(h.substring(0,2),16)
      const g = parseInt(h.substring(2,4),16)
      const b = parseInt(h.substring(4,6),16)
      const mix = (c: number) => Math.round(c + (255-c)*0.4)
      return new THREE.Color(mix(r)/255, mix(g)/255, mix(b)/255)
    }

    const basePrimary = primaryColor || '#7CC6FF'
    const colors = {
      primary: pastel(basePrimary),
      secondary: pastel('#FFB3D9'),
      accent: pastel('#B3FFB3'),
      cheek: new THREE.Color('#FFB6C1'),
      white: new THREE.Color('#FFFFFF'),
      dark: new THREE.Color('#2C2C2C')
    }

    // Create materials (basic for AR performance)
    const primaryMaterial = new THREE.MeshBasicMaterial({ color: colors.primary });
    const secondaryMaterial = new THREE.MeshBasicMaterial({ color: colors.secondary });
    const accentMaterial = new THREE.MeshBasicMaterial({ color: colors.accent });
    const whiteMaterial = new THREE.MeshBasicMaterial({ color: colors.white });
    const darkMaterial = new THREE.MeshBasicMaterial({ color: colors.dark });

    // Main body (exact same as CuteAvatarPet)
    const bodyGeometry = new THREE.SphereGeometry(1.2, 16, 16);
    const body = new THREE.Mesh(bodyGeometry, primaryMaterial);
    body.position.set(0, 0, 0);
    body.name = 'body';
    group.add(body);

    // Head (exact same)
    const headGeometry = new THREE.SphereGeometry(0.85, 16, 16);
    const head = new THREE.Mesh(headGeometry, primaryMaterial);
    head.position.set(0, 0.8, 0);
    head.name = 'head';
    group.add(head);

    // Eyes (exact same positioning and scaling)
    const EYE_Y = 1.04;
    const EYE_Z = 0.82;
    const R_WHITE = 0.153;
    
    const eyeGeometry = new THREE.SphereGeometry(R_WHITE, 8, 8);
    
    const leftEye = new THREE.Mesh(eyeGeometry, whiteMaterial);
    leftEye.position.set(-0.32, EYE_Y, EYE_Z);
    leftEye.scale.set(1, 1, 0.12);
    leftEye.name = 'leftEye';
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, whiteMaterial);
    rightEye.position.set(0.32, EYE_Y, EYE_Z);
    rightEye.scale.set(1, 1, 0.12);
    rightEye.name = 'rightEye';
    group.add(rightEye);

    // Iris (exact same)
    const irisGeometry = new THREE.SphereGeometry(0.085, 8, 8);
    const irisMaterial = new THREE.MeshBasicMaterial({ color: colors.primary });

    const leftIris = new THREE.Mesh(irisGeometry, irisMaterial);
    leftIris.position.set(-0.32, EYE_Y, 0.9);
    leftIris.scale.set(1, 1, 0.08);
    leftIris.name = 'leftIris';
    group.add(leftIris);

    const rightIris = new THREE.Mesh(irisGeometry, irisMaterial);
    rightIris.position.set(0.32, EYE_Y, 0.9);
    rightIris.scale.set(1, 1, 0.08);
    rightIris.name = 'rightIris';
    group.add(rightIris);

    // Pupils (exact same)
    const pupilGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    
    const leftPupil = new THREE.Mesh(pupilGeometry, darkMaterial);
    leftPupil.position.set(-0.32, EYE_Y, 0.95);
    leftPupil.scale.set(1, 1, 0.06);
    leftPupil.name = 'leftPupil';
    group.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeometry, darkMaterial);
    rightPupil.position.set(0.32, EYE_Y, 0.95);
    rightPupil.scale.set(1, 1, 0.06);
    rightPupil.name = 'rightPupil';
    group.add(rightPupil);

    // Small highlights (flattened as requested)
    const smallHighlightGeometry = new THREE.SphereGeometry(0.02, 6, 6);
    const smallHighlightMaterial = new THREE.MeshBasicMaterial({
      color: colors.white,
      transparent: true,
      opacity: 0.7
    });

    const leftSmallHighlight = new THREE.Mesh(smallHighlightGeometry, smallHighlightMaterial);
    leftSmallHighlight.position.set(-0.34, EYE_Y - 0.06, 1.001);
    leftSmallHighlight.scale.set(1, 1, 0.1);
    leftSmallHighlight.name = 'leftSmallHighlight';
    group.add(leftSmallHighlight);

    const rightSmallHighlight = new THREE.Mesh(smallHighlightGeometry, smallHighlightMaterial);
    rightSmallHighlight.position.set(0.30, EYE_Y - 0.06, 1.001);
    rightSmallHighlight.scale.set(1, 1, 0.1);
    rightSmallHighlight.name = 'rightSmallHighlight';
    group.add(rightSmallHighlight);

    // Mouth (exact same mood-based logic as CuteAvatarPet)
    const mouthGeometry = new THREE.TorusGeometry(0.15, 0.04, 8, 16);
    const mouth = new THREE.Mesh(mouthGeometry, darkMaterial);
    mouth.position.set(0, 0.6, 0.4);
    mouth.name = 'mouth';
    
    if (mood === 'happy') {
      mouth.scale.set(1.2, 0.6, 0.3);
    } else if (mood === 'sad') {
      mouth.scale.set(0.8, 0.6, 0.2);
      mouth.rotation.z = Math.PI;
    } else if (mood === 'sleepy') {
      mouth.scale.set(0.6, 0.4, 0.15);
    } else {
      mouth.scale.set(1, 0.4, 0.25);
    }
    
    group.add(mouth);

    // Arms (exact same)
    const armGeometry = new THREE.SphereGeometry(0.25, 8, 8);
    
    const leftArm = new THREE.Mesh(armGeometry, accentMaterial);
    leftArm.position.set(-1.2, 0.2, 0);
    leftArm.name = 'leftArm';
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, accentMaterial);
    rightArm.position.set(1.2, 0.2, 0);
    rightArm.name = 'rightArm';
    group.add(rightArm);

    // Feet (exact same)
    const footGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    
    const leftFoot = new THREE.Mesh(footGeometry, secondaryMaterial);
    leftFoot.position.set(-0.5, -1.0, 0.2);
    leftFoot.name = 'leftFoot';
    group.add(leftFoot);

    const rightFoot = new THREE.Mesh(footGeometry, secondaryMaterial);
    rightFoot.position.set(0.5, -1.0, 0.2);
    rightFoot.name = 'rightFoot';
    group.add(rightFoot);

    // Cheeks for happy mood (exact same)
    if (mood === 'happy') {
      const cheekGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const cheekMaterial = new THREE.MeshBasicMaterial({
        color: colors.cheek,
        transparent: true,
        opacity: 0.6
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

    // Scale for AR (smaller)
    group.scale.setScalar(0.5);
    
    return group;
  }

  /**
   * Generate GLB data for a mood
   */
  private async generateGLB(mood: string, primaryColor: string): Promise<ArrayBuffer> {
    const model = this.createExactPetModel(mood, primaryColor);
    
    return new Promise((resolve, reject) => {
      this.exporter.parse(
        model,
        (result) => {
          if (result instanceof ArrayBuffer) {
            resolve(result);
          } else {
            reject(new Error('Expected ArrayBuffer'));
          }
        },
        (error) => reject(error),
        {
          binary: true,
          embedImages: true,
          maxTextureSize: 512, // Small textures for fast loading
          animations: this.createPetAnimations(model) // Add animations
        }
      );
    });
  }

  /**
   * Create animations for the pet model
   */
  private createPetAnimations(model: THREE.Group): THREE.AnimationClip[] {
    const animations: THREE.AnimationClip[] = [];

    // Levitation animation (gentle floating)
    const levitationTrack = new THREE.VectorKeyframeTrack(
      model.name + '.position',
      [0, 1, 2], // keyframe times in seconds
      [0, 0, 0,  0, 0.1, 0,  0, 0, 0] // position values (x,y,z)
    );
    
    const levitationClip = new THREE.AnimationClip('levitation', 2, [levitationTrack]);
    levitationClip.tracks.push(levitationTrack);
    animations.push(levitationClip);

    // Tap animation (bounce effect)
    const tapScaleTrack = new THREE.VectorKeyframeTrack(
      model.name + '.scale',
      [0, 0.1, 0.2], // quick bounce
      [0.5, 0.5, 0.5,  0.6, 0.6, 0.6,  0.5, 0.5, 0.5] // scale values
    );
    
    const tapClip = new THREE.AnimationClip('tap', 0.2, [tapScaleTrack]);
    animations.push(tapClip);

    return animations;
  }

  /**
   * Get GLB blob URL for a mood (cached)
   */
  async getModelBlobURL(mood: string, primaryColor: string = '#7CC6FF'): Promise<string> {
    const cacheKey = `${mood}_${primaryColor}`;
    
    if (this.modelCache.has(cacheKey)) {
      return this.modelCache.get(cacheKey)!;
    }

    try {
      const glbBuffer = await this.generateGLB(mood, primaryColor);
      const blob = new Blob([glbBuffer], { type: 'model/gltf-binary' });
      const url = URL.createObjectURL(blob);
      
      this.modelCache.set(cacheKey, url);
      return url;
    } catch (error) {
      console.error(`Failed to generate ${mood} model:`, error);
      throw error;
    }
  }

  /**
   * Preload all mood models
   */
  async preloadAllModels(primaryColor: string = '#7CC6FF'): Promise<void> {
    const moods = ['happy', 'neutral', 'sad', 'sleepy'];
    
    const promises = moods.map(mood => 
      this.getModelBlobURL(mood, primaryColor).catch(error => {
        console.warn(`Failed to preload ${mood} model:`, error);
        return null;
      })
    );

    await Promise.all(promises);
    console.log('All pet models preloaded for AR');
  }

  /**
   * Clear cache and revoke blob URLs
   */
  clearCache(): void {
    this.modelCache.forEach(url => {
      URL.revokeObjectURL(url);
    });
    this.modelCache.clear();
  }
}

export default PrebuiltModelsService.getInstance();