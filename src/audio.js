import workFile from "url:./volume-worklet.js";

export function askMicrophonePermission(onVolume) {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  navigator.getUserMedia(
    { audio: true },
    async function onMicrophonePermission(stream) {
      const audioContext = new AudioContext();
      await audioContext.audioWorklet.addModule(workFile);
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
