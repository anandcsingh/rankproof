import Master from '../components/layout/Master'
import AuthPage from '../components/layout/AuthPage'

import { useEffect, useState } from "react";
import { CircuitString, Poseidon, PublicKey } from "snarkyjs";
import './reactCOIServiceWorker';
import ZkappWorkerClient from './rankedWorkerClient';
import { isPropertySignature } from "typescript";
import Authentication from '@/modules/Authentication';
export default function Tester() {
    
    let [state, setState] = useState({
        zkappWorkerClient: null as null | ZkappWorkerClient,
        zkappPublicKey: null as null | PublicKey,
        hasWallet: null as null | boolean,
        hasBeenSetup: false,
        accountExists: false,
        query: "",
        onchain: "",
        json: "",
        deleteAddress: "",
        instructorAddress: "",
        queried: false,
        onchained: false,
        currentInstructor: "",
        sampleJson: ""
    });

    async function logContractDetails() {
        const zkappWorkerClient = Authentication.zkClient ?? new ZkappWorkerClient();
    
        const zkappPublicKey = PublicKey.fromBase58(Authentication.contractAddress);
        await zkappWorkerClient.initZkappInstance(zkappPublicKey);
    
        console.log('getting zkApp state...');
        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
        const currentNum = await zkappWorkerClient.getIbjjf();
        console.log('current ibjjf:', currentNum.toString());
        const currentInstructor = await zkappWorkerClient.getInstructor();
        console.log('current instructor: ', currentInstructor.toBase58());
    
        setState({
            ...state,
            zkappWorkerClient,
            hasWallet: true,
            hasBeenSetup: true,
            zkappPublicKey
        });
    }

    const handleInstrutorChange = async (e: any) =>  {
        setState({ ...state, instructorAddress: e.target.value });
    }
    const changeInstructor = async (event: any) => {
        event.preventDefault();
        const zkappWorkerClient = Authentication.zkClient ?? new ZkappWorkerClient();
        const zkappPublicKey = PublicKey.fromBase58(Authentication.contractAddress);
        await state.zkappWorkerClient!.fetchAccount({ publicKey: zkappPublicKey });
    
        const currentInstructor = await zkappWorkerClient.getInstructor();
        console.log('current instructor: ', currentInstructor.toBase58());
        
        const blackbelt = PublicKey.fromBase58(state.instructorAddress);
        console.log("sending blackbelt as: ", blackbelt.toBase58());
        await state.zkappWorkerClient!.createUpdateBlackBeltTransaction(blackbelt);

        console.log('creating proof...');
        await state.zkappWorkerClient!.fetchAccount({ publicKey: state.zkappPublicKey! });
        await state.zkappWorkerClient!.proveUpdateTransaction();
        await state.zkappWorkerClient!.fetchAccount({ publicKey: state.zkappPublicKey! });

        console.log('getting Transaction JSON...');
        const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON()
        let transactionFee = 0.1;
        await state.zkappWorkerClient!.fetchAccount({ publicKey: state.zkappPublicKey! });

        console.log('requesting send transaction...');
        const { hash } = await (window as any).mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                fee: transactionFee,
                memo: '',
            },
        });

        console.log(
            'See transaction at https://berkeley.minaexplorer.com/transaction/' + hash
        );
        
    }

    useEffect(() => {
        (async () => {
            await logContractDetails();
        })();
    }, []);
    return (
        <Master>
            <AuthPage>
                <h1>Tester</h1>
                <div>
<form className="m-4 flex">
<input id="instructor" onChange={handleInstrutorChange} name="instructor" className="rounded-l-lg p-4 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white" placeholder="Mina address"/>
<button onClick={changeInstructor} className="px-8 rounded-r-lg bg-yellow-400 text-gray-800 font-bold p-4 uppercase border-yellow-500 border-t border-b border-r">Change instructor</button>
</form>
</div>
<hr></hr>
<div>
<button onClick={logContractDetails} className="h-10 px-6 font-semibold rounded-md bg-black text-white" type="submit">List contract data</button>
</div>
            </AuthPage>
        </Master>
    );
}


