import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import Authentication from '../../modules/Authentication';
import ZkappWorkerClient from '../../pages/rankedWorkerClient';
import Router from 'next/router';
import { useEffect, useState } from "react";
import Snackbar from '../../modules/Snackbar'
import Script from 'next/script'


import {
  PublicKey,
  PrivateKey,
  Field,
} from 'snarkyjs'

const AuthPage = ({ children }) => {
  // load from Authentication values
  //Authentication.getNum();
  let [state, setState] = useState({
    authentication: null,
    hasWallet: Authentication.hasWallet,
    hasBeenSetup: Authentication.hasBeenSetup,
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
    (async () => {
      if (!Authentication.loggedIn) {
        if (!state.hasBeenSetup) {

          const zkappWorkerClient = new ZkappWorkerClient();
          Authentication.setZkClient(zkappWorkerClient);
          const loadedSnarky = await Authentication.loadSnarky();
          setState({ ...state, snarkyLoaded: true });
          const hasWallet = await Authentication.checkForWallet();
          if (!hasWallet) {
            setState({ ...state, hasWallet: false, snarkyLoaded: true });
            return;
          }
          else {
            setState({ ...state, hasWallet: true, snarkyLoaded: true, showRequestingAccount: true });
          }

          const loginResult = await Authentication.login();

          if (loginResult.error == "user reject") {
            Snackbar("You cancelled connection with Mina wallet!", 1500);
          }
          else if (loginResult.error == "please create or restore wallet first") {
            setState({ ...state, showCreateWallet: true, hasWallet: true, snarkyLoaded: true, showRequestingAccount: false });
          }


          const accountExists = await Authentication.doesAccountExist();
          if (!accountExists) {
            setState({ ...state, showFundAccount: true, showCreateWallet: false, hasWallet: true, snarkyLoaded: true, showRequestingAccount: false });
          }
          else {
            setState({ ...state, showLoadingContracts: true, showFundAccount: false, showCreateWallet: false, hasWallet: true, snarkyLoaded: true, showRequestingAccount: false });
            const hasBeenSetup = await Authentication.setupContracts();

            setState({ ...state, hasBeenSetup: hasBeenSetup, showLoadingContracts: false, showFundAccount: false, showCreateWallet: false, hasWallet: true, snarkyLoaded: true, showRequestingAccount: false });
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
    <div className='keito-page'>
      
      <div className='keito-content-wrap'>
        <Header />
        <main className="site-content">
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
        </main>
      
      </div>
      <Footer />
    </div>

  );

}

export default AuthPage;