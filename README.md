# Welcome to RankProof

My submission for Mina Protocol's zkIgnite Cohort 1. RankProof is a platform for managing digital certifications for Martial Artists worldwide built on Mina Protocol using snarkyjs and Zero Knowledge Proofs.

## Main components

### Smart Contract

[AllMartialArtsEvents.ts](https://github.com/anandcsingh/rankproof/blob/main/contracts/src/AllMartialArtsEvents.ts)

### RankProof Service Layer

[AllMaWorkerEvents.ts](https://github.com/anandcsingh/rankproof/blob/main/ui/src/modules/workers/AllMaWorkerEvents.ts)

### Authentication

[AuthPage.js](https://github.com/anandcsingh/rankproof/blob/main/ui/src/components/layout/AuthPage.js)

[Authentication.js](https://github.com/anandcsingh/rankproof/blob/main/ui/src/modules/Authentication.js)

## Architecture

![image](https://github.com/anandcsingh/rankproof/assets/4129994/7c0c4543-338f-4648-a3b4-22782a241701)


## Setup

See Mina docs [How to write a zkApp](https://docs.minaprotocol.com/zkapps/how-to-write-a-zkapp)

### Install CLI
```
npm install -g zkapp-cli
```
### Build contracts
Navigate to contracts folder
```
npm install
```
```
npm run build
```

### Run Web UI
Naviagte to ui folder

```
npm install
```

```
npm run dev
```
