
import Master from '../components/layout/Master'
import Head from 'next/head';
import Link from 'next/link'
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home() {
 

  return (
    <>
   <Master>
   <div className="badge badge-primary badge-lg"> TEST BADGE </div>
<div className="badge badge-primary badge-md"></div>
<div className="badge badge-primary badge-sm"></div>
<div className="badge badge-primary badge-xs"></div>

<div className="radial-progress" style={{"--value":0}}>0%</div>
<div className="radial-progress" style={{"--value":20}}>20%</div>
<div className="radial-progress" style={{"--value":60}}>60%</div>
<div className="radial-progress" style={{"--value":80}}>80%</div>
<div className="radial-progress" style={{"--value":100}}>100%</div>
          <div className={styles.center}>
            <a
              href="https://minaprotocol.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className={styles.logo}
                src="/assets/HeroMinaLogo.svg"
                alt="Mina Logo"
                width="191"
                height="174"
                priority
              />
            </a>
            <p className={styles.tagline}>
              built with
              <code className={styles.code}> SmoothJS</code>
            </p>
          </div>
          <p className={styles.start}>
            Get started by editing
            <code className={styles.code}> src/pages/index.tsx</code>
          </p>
          <div className={styles.grid}>
           
            <Link className={styles.card} href="login">

              <h2>
                <span>Login</span>
                <div>
                  <Image
                    src="/assets/arrow-right-small.svg"
                    alt="Mina Logo"
                    width={16}
                    height={16}
                    priority
                  />
                </div>
              </h2>
              <p>Explore zkApps, how to build one, and in-depth references</p>
            
            </Link>
            <a
              href="https://docs.minaprotocol.com/zkapps/tutorials/hello-world"
              className={styles.card}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>
                <span>TUTORIALS</span>
                <div>
                  <Image
                    src="/assets/arrow-right-small.svg"
                    alt="Mina Logo"
                    width={16}
                    height={16}
                    priority
                  />
                </div>
              </h2>
              <p>Learn with step-by-step SnarkyJS tutorials</p>
            </a>
            <a
              href="https://discord.gg/minaprotocol"
              className={styles.card}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>
                <span>QUESTIONS</span>
                <div>
                  <Image
                    src="/assets/arrow-right-small.svg"
                    alt="Mina Logo"
                    width={16}
                    height={16}
                    priority
                  />
                </div>
              </h2>
              <p>Ask questions on our Discord server</p>
            </a>
            <a
              href="https://docs.minaprotocol.com/zkapps/how-to-deploy-a-zkapp"
              className={styles.card}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>
                <span>DEPLOY</span>
                <div>
                  <Image
                    src="/assets/arrow-right-small.svg"
                    alt="Mina Logo"
                    width={16}
                    height={16}
                    priority
                  />
                </div>
              </h2>
              <p>Deploy a zkApp to Berkeley Testnet</p>
            </a>
          </div>
          </Master>
          </>
  );
}
