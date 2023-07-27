import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import Authentication from '../../modules/Authentication';
import RankedBjjWorkerClient from '../../modules/workers/rankedBjjWorkerClient';
import AddBjjRankWorkerClient from '../../modules/workers/bjj/AddBjjRankWorkerClient';
import PromoteBjjStudentWorkerClient from '../../modules/workers/bjj/PromoteBjjStudentWorkerClient';
import ZkappWorkerClient from '../../pages/rankedWorkerClient';
import Router from 'next/router';
import { useEffect, useState } from "react";
import Snackbar from '../../modules/Snackbar'
import Script from 'next/script'
import { ContractsLoader } from '../../modules/ContractsLoader';

import {
  PublicKey,
  PrivateKey,
  Field,
} from 'snarkyjs'

const AuthPage = ({ validate, children }) => {
  // load from Authentication values
  //Authentication.getNum();
  let [state, setState] = useState({
    authentication: null,
    hasWallet: Authentication.hasWallet,
    hasBeenSetup: validate ? Authentication.hasBeenSetup : true,
    accountExists: Authentication.accountExists,
    currentNum: null,
    publicKey: null,
    zkappPublicKey: null,
    creatingTransaction: false,
    snarkyLoaded: Authentication.sn,
    showRequestingAccount: false,
    showCreateWallet: false,
    showFundAccount: false,
    showLoadingContracts: false
  });

  useEffect(() => {

    function timeout(seconds) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve();
        }, seconds * 1000);
      });
    }


    (async () => {
      if (!Authentication.loggedIn) {
        if (!state.hasBeenSetup) {
          console.log("setting up");
          //const zkappWorkerClient = new RankedBjjWorkerClient();
          const zkappWorkerClient = new AddBjjRankWorkerClient();
          const zkappWorkerClient2 = new PromoteBjjStudentWorkerClient();
          //const zkappWorkerClient = new ZkappWorkerClient();
          //const zkappWorkerClient = new ProofOfRankWorkerClient();
          const contractsLoader = new ContractsLoader();
          Authentication.setContractsLoader(contractsLoader);
          Authentication.setZkClient(zkappWorkerClient);
          Authentication.setBjjAddClient(zkappWorkerClient);
          Authentication.setBjjPromoteClient(zkappWorkerClient2);
          await timeout(15);
          console.log("loading snarky");
          try {
            const loadedSnarky = await Authentication.loadSnarky();
          } catch (e) {
            console.log("error loading snarky", e);
          }

          console.log("loadedSnarky");
          setState({ ...state, snarkyLoaded: true });
          const hasWallet = await Authentication.checkForWallet();
          if (!hasWallet) {
            setState({ ...state, hasWallet: false, snarkyLoaded: true });
            return;
          }
          else {
            setState({ ...state, hasWallet: true, snarkyLoaded: true, showRequestingAccount: true });
            console.log("has wallet");
          }
          console.log("requesting account");
          const loginResult = await Authentication.login();
          console.log("login result", loginResult);

          if (loginResult.error == "user reject") {
            Snackbar("You cancelled connection with Mina wallet!", 1500);
          }
          else if (loginResult.error == "please create or restore wallet first") {
            setState({ ...state, showCreateWallet: true, hasWallet: true, snarkyLoaded: true, showRequestingAccount: false });
          }

          console.log("checking account");
          const accountExists = await Authentication.doesAccountExist();
          if (!accountExists) {
            setState({ ...state, showFundAccount: true, showCreateWallet: false, hasWallet: true, snarkyLoaded: true, showRequestingAccount: false });
          }
          else {
            setState({ ...state, showLoadingContracts: true, showFundAccount: false, showCreateWallet: false, hasWallet: true, snarkyLoaded: true, showRequestingAccount: false });
            const hasBeenSetup = Authentication.setupContracts();
            setState({ ...state, hasBeenSetup: hasBeenSetup, showLoadingContracts: false, showFundAccount: false, showCreateWallet: false, hasWallet: true, snarkyLoaded: true, showRequestingAccount: false });

            // console.log('fetching account');
            // await Authentication.zkClient.fetchAccount({ publicKey: PublicKey.fromBase58(Authentication.contractAddress) });
            // console.log('fetching account done');
            // console.log('fetching storage root');
            // let root = await Authentication.zkClient.getNum();
            // console.log("storage root", root.toString());
          }

        }
      }
    })();
  }, []);



  const loginClicked = async () => {
    try {
      const loggedIn = await Authentication.login();
      if (loggedIn) {
        Router.push('/dashboard');
      }
    }
    catch (e) {
      console.log("Login Failed", e.message);
      if (e.message == "user reject") {
        Snackbar("You cancelled connection with Mina wallet!", 1500);
      }
    }
    // const loggedIn = Authentication.login();
    // if (Authentication.loggedIn) {
    //   Router.push('/dashboard')
    // }
  }
  return (
    <div className='rankproof-page'>

      <div className='rankproof-content-wrap'>


        {!state.hasBeenSetup ?
          <section className="hero section center-content has-top-divider">
            <div className="container-sm">
              <div className="hero-inner section-inner">
                <div className="hero-content">
                  <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
                    Getting things ready...

                  </h1>
                  <div className="container-xs">
                    <div className={`${!state.snarkyLoaded || state.showRequestingAccount || state.showLoadingContracts ? 'loading-snarky' : ''} m-0 mb-32 reveal-from-bottom login-subtext p-16`} data-reveal-delay="400">
                      <div style={{ display: state.snarkyLoaded ? "none" : "block" }}>
                        Loading <span className="text-color-primary">SnarkyJS</span>...
                      </div>
                      {state.hasWallet != null && !state.hasWallet &&
                        <div className='text-color-warning'>
                          Could not find a wallet. Install Auro wallet here <a href='https://www.aurowallet.com/' target="_blank" rel="noreferrer">Auro wallet</a>
                        </div>
                      }

                      {state.showRequestingAccount &&
                        <div>Requesting account</div>
                      }

                      {state.showCreateWallet &&
                        <div className='text-color-warning'>Please create or restore a wallet first!</div>
                      }
                      {state.showFundAccount &&
                        <div className='text-color-warning'>Your account does not exist, visit the <a href="https://faucet.minaprotocol.com/" target="_blank" rel="noreferrer">faucet</a> to fund it</div>
                      }

                      {state.showLoadingContracts &&
                        <div>Loading contracts...</div>
                      }



                    </div>
                    <div className="reveal-from-bottom login-btn-container" data-reveal-delay="600">
                      {/* Button area */}
                    </div>

                  </div>
                </div>


              </div>
            </div>
          </section>
          :
          <div>
            {children}
          </div>
        }

      </div>

    </div>

  );

}

export default AuthPage;