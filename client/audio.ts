import workletURL from "./lib/volume-worklet.js?url";

////////////////////////////////////////
// Step 1: Connecting to user media to retrieve volume.
////////////////////////////////////////

export async function askMicrophonePermission(
  onVolume: (volume: number) => void
) {
  const media = await navigator.mediaDevices.getUserMedia({audio: true});
  const audioContext = new AudioContext();
  const stream = audioContext.createMediaStreamSource(media);

  await audioContext.audioWorklet.addModule(workletURL);
  const workletNode = new AudioWorkletNode(audioContext, 'volumeworklet');
  workletNode.port.onmessage = (message) => {
    onVolume(message.data.volume);
  };

  stream.connect(workletNode).connect(audioContext.destination);
}

export default askMicrophonePermission;
