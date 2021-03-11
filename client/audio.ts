import workletURL from "./lib/volume-worklet.js?url";

////////////////////////////////////////
// Step 1: Connecting to user media to retrieve volume.
////////////////////////////////////////

export async function askMicrophonePermission(
  onVolume: (volume: number) => void
) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  const microphoneStream = audioContext.createMediaStreamSource(stream);

  await audioContext.audioWorklet.addModule(workletURL);
  const volumeNode = new AudioWorkletNode(audioContext, "volumeworklet");
  volumeNode.port.onmessage = (event) => {
    onVolume(event.data.volume);
  };

  microphoneStream.connect(volumeNode).connect(audioContext.destination);
}

export default askMicrophonePermission;
