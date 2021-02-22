////////////////////////////////////////
// Step 1: Connecting to user media to retrieve volume.
////////////////////////////////////////
export function askMicrophonePermission(onVolume: (volume: number) => void) {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    (navigator as any).webkitGetUserMedia ||
    (navigator as any).mozGetUserMedia;

  navigator.getUserMedia(
    { audio: true },
    async function onMicrophonePermission(stream) {
      const audioContext = new AudioContext();
      await audioContext.audioWorklet.addModule("./volume-worklet.js");
      const microphoneStream = audioContext.createMediaStreamSource(stream);

      const volumeNode = new AudioWorkletNode(audioContext, "volumeworklet");
      volumeNode.port.onmessage = (event) => {
        onVolume(event.data.volume);
      };

      microphoneStream.connect(volumeNode).connect(audioContext.destination);
    },
    onMicrophoneDenied
  );
}

const onMicrophoneDenied = () =>
  console.error("Microphone access was not granted");

export default askMicrophonePermission;
