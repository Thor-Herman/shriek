## Getting started

Krav til kjøring:

1. [node](https://nodejs.org/en/download/)
1. (valgfritt [`yarn`](https://classic.yarnpkg.com/en/docs/install))

### Install & Start

```
# Clone repo
git clone https://github.com/varianter/shriek.git

# Naviger inn til root
cd shriek

# Installer avhengigheter
yarn
# Eller npm om du foretrekker det

# Start opp løsningen
yarn dev
# Eller npm run dev

# Åpne løsningen i nettleseren.
open http://localhost:3000
```

Endre kode under `./client/` for å se resultatet i nettleseren.

## Oppgaver

Slides: https://varianter.github.io/shriek-slides/

#### Oppgave 1: Volume progress (20min)

Implementer uthenting av volum basert på UserMedia, AudioWorklets og bruk `client/lib/test-volume.ts` for å bekrefte at alt fungerer.

#### Oppgave 2: Drive (30min)

1. Lag en enkel render-loop.
1. Lag en `ControlInput` modul som holder tilstand på venstre/høyre.
1. Bruk `cart.updateByVolume` til å hente ut ny `x`, `y`, og `degrees`.
1. bruk `transform` basert på resultat.
1. Kjør cart!

#### Oppgave 3: PeerJS

Ta i bruk `connectPeer` for å koble til server.

1. Connect og send inn Nick.
1. Tegn vegger, mål og motstandere.
1. Gi varsel (`window.alert`) om noen vinner.
1. Send nye kordinater via server.
