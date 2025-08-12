export interface ARConfig {
  iosUSDZPath: string; // Path under /public for iOS Quick Look
  androidGLBPath?: string; // Optional: Path under /public for Android Scene Viewer (if you want it)
}

export const arConfig: ARConfig = {
  iosUSDZPath: "/ar/pet.usdz",
  // androidGLBPath: "/ar/pet.glb",
};

