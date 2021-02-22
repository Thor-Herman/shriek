## Outline

Utgangspunkt: Starter med en blank "verden" med et spillerikon og car.js som lib som eksponerer nødvendig API, og en rimelig barebones game.js

Timeline:

- Snakk om getUserMedia og AudioContext
- Deltaker skal implementere en `audio.js` hvor getUserMedia kalles, og en AudioContext med de riktige nodene settes opp. (Inkludere en eller annen artig demo før vi henter inn audio-worklet?). Deretter konsoll-log ut data fra audio-worklet callback.
- Sende inn callback i metode som implementerer getUserMedia for å "message" volumet ut av `audio.js`
- Snakke om `requestAnimationFrame` (sammenligne med `setInterval`?). Hvor vi skal bruke det som game-loop, osv.
- Deltaker implementerer `requestAnimationFrame` hvor volumet sendes inn til `car.updateByVolume`
- Snakk CSS transforms og bruken av `translate`, `rotate`. Videre snakk om `document.querySelector` og bruke dette for å hente ut spiller-elementet
- Deltaker skriver en transform-streng i game-loop, og oppdaterer spiller sin posisjon med denne
- Gjennomgang på document-eventlisteneres og keydown/keyup, + snakke om closures
- Deltaker implementerer kontroller for A/D eller piltaster om de ønsker for å svinge - og sender inn dette til `car` (car.js bør kanskje eksponere API for å svinge?)
- Gjennomgang på P2P, WebRTC og Peer.JS?
- Enkel intro til Peer.js lokalt?
- Så implementere mot server
- Collision? Burde denne vært i updateByVolume?
