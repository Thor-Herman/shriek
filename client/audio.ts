import workletURL from "./lib/volume-worklet.js?url";

////////////////////////////////////////
// Step 1: Connecting to user media to retrieve volume.
////////////////////////////////////////

export async function askMicrophonePermission(
  onVolume: (volume: number) => void
) {}

export default askMicrophonePermission;
