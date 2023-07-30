import QRCodeScanner from "@/components/QRCodeScanner";
import { AuthContext } from "@/components/layout/AuthPage";
import Authentication from "@/modules/Authentication";
import AllMaWorkerClient from "@/modules/workers/AllMaWorkerClient";
import Router from 'next/router';
import { useContext, useState } from "react";
import { PublicKey } from "snarkyjs";

const PromoteForm = () => {
    const [authState, setAuthState] = useContext(AuthContext);
    const [disciplineValue, setDisciplineValue] = useState('');
    const handleDiscipleineChange = async (event: any) => {
      setDisciplineValue(event.target.value);
    };
    const [rankValue, setRankValue] = useState('');
    const handleRankChange = async (event: any) => {
      setRankValue(event.target.value);
    };
    const [studentValue, setStudentValue] = useState('');
    const handleStudentChange = async (event: any) => {
        setStudentValue(event.target.value);
    };
    const [notifyStudentValue, setNotifyStudentValue] = useState('');
    const handleNotifyStudentChange = async (event: any) => {
      setNotifyStudentValue(event.target.value);
    };
    const handleScan = async (event: any) => {
        if (event) {
          console.log(event);
          setStudentValue(event);
        }
      }

      
  const promoteMartialArtist = async (event: any) => {
  
    setAuthState({ ...authState, alertAvailable: true, alertMessage: `Promoting Martial Artist, please wait this can take a few mins`, alertNeedsSpinner: true });
    Router.back();
    console.log("Discipline: ", disciplineValue);
    console.log("Rank: ", rankValue);
    console.log("student: ", studentValue);
    console.log("Notify Instructor: ", notifyStudentValue);

    let instructorID = Authentication.address;
     let studentID = studentValue;
     console.log("studentID", studentID);
     let client = Authentication.zkClient! as AllMaWorkerClient;
     console.log('client', client);
     console.log('adding martial art...', disciplineValue, rankValue);
     console.log('fetching account...');
    setAuthState({ ...authState, alertAvailable: true, alertMessage: `Fetching account, please wait this can take a few mins`, alertNeedsSpinner: true });

     await client.fetchAccount({ publicKey: PublicKey.fromBase58(Authentication.contractAddress) });
    setAuthState({ ...authState, alertAvailable: true, alertMessage: `Invoking contracts, please wait this can take a few mins`, alertNeedsSpinner: true });

     console.log(`fetching account done ${Authentication.contractAddress}`);
 
     if(disciplineValue == "BJJ") {
        console.log("promoting bjj...");
        await client.promoteBjjStudent(studentID, rankValue, instructorID);
      } else if(disciplineValue == "Judo") {
        console.log("promoting judo...");
        await client.promoteJudoStudent(studentID, rankValue, instructorID);
      } else if(disciplineValue == "Karate") {
        console.log("promoting karate...");
        await client.promoteKarateStudent(studentID, rankValue, instructorID);
      }
     console.log("proving update transaction...");
    setAuthState({ ...authState, alertAvailable: true, alertMessage: `Proving transaction, please wait this can take a few mins`, alertNeedsSpinner: true });

     await client.proveUpdateTransaction();
     console.log("sending transaction...");
    setAuthState({ ...authState, alertAvailable: true, alertMessage: `Sending transaction, please approve the transaction on your wallet`, alertNeedsSpinner: true });

     let hash = await client.sendTransaction();
     console.log("transaction sent");
 
     
     // if hash is not empty or null, then we have a transaction hash
      if(hash) {
     
      if(disciplineValue == "BJJ") {
        await client.updateBjjBackingStore(studentID, rankValue);
        } else if (disciplineValue == "Judo") {
          await client.updateJudoBackingStore(studentID, rankValue);
        } else if (disciplineValue == "Karate") {
          await client.updateKarateBackingStore(studentID, rankValue);
        }

        let hashStr = `https://berkeley.minaexplorer.com/transaction/${hash}`;
        let hashlink = `<a href="${hashStr}" class="btn btn-sm" target="_blank">View transaction</a>`;
        setAuthState({ ...authState, alertAvailable: true, alertMessage: `Add martial art transaction submitted ${hashlink}`, alertNeedsSpinner: false });

        
      }
      else {
        setAuthState({ ...authState, hasAlert: true, alertMessage: `Add martial art transaction failed, try again later`, needsLoading: false });
      }
  }

  
    return (
        <div>
            <h2 className='text-3xl font-bold sm:text-4xl'>Promote your student</h2>
                  <div className='divider'></div>
                  <div className='grid grid-cols-1 space-y-6'>

                  <div className="form-control">
                      <label className="label">
                        <span className="text-base label-text">Student address</span>
                      </label>
                      <div className="join">
                      <QRCodeScanner onScan={handleScan} />
                      <input onChange={handleStudentChange} value={studentValue} className="input input-bordered join-item bg-white" />
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="text-base label-text">Marital Art discipline</span>
                      </label>
                      <select  onChange={handleDiscipleineChange} className="select select-bordered w-full max-w-xs bg-white">
                        <option>Select a Martial Art</option>
                        <option>BJJ</option>
                        <option>Judo</option>
                        <option>Karate</option>
                      </select>


                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="text-base label-text">Marital Art rank</span>
                      </label>
                      <select onChange={handleRankChange}  className="select select-bordered w-full max-w-xs bg-white">
                        <option>Select a Rank</option>
                        <option>White Belt</option>
                        <option>Blue Belt</option>
                        <option>Pruple Belt</option>
                        <option>Brown Belt</option>
                        <option>Black Belt</option>
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Notfiy your student?</span>
                        <input onChange={handleNotifyStudentChange} type="checkbox" className="checkbox" />
                      </label>

                    </div>

                    
                    <div className=''>
                      <button onClick={promoteMartialArtist} className="btn btn-accent">Promote</button>
                    </div>
                  </div>

                </div>
    );
}
export default PromoteForm;