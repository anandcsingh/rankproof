
const ProveForm = () => {

    return (
        <div>
            <h2 className='text-3xl font-bold sm:text-4xl'>Prove your rank</h2>
                  <div className='divider'></div>
                  <div className='grid grid-cols-1 space-y-6'>
                    <div className="form-control">
                      <label className="label">
                        <span className="text-base label-text">Marital Art discipline</span>
                      </label>
                      <select className="select select-bordered w-full max-w-xs bg-white">
                        <option>Select a Martial Art</option>
                        <option>BJJ</option>
                        <option>Judo</option>
                        <option>Karate</option>
                      </select>


                    </div>


                    <div className="form-control">
                      <label className="label">
                        <span className="text-base label-text">Inquirer address</span>
                      </label>
                      <div className="join">
                        <input className="input input-bordered join-item bg-white" />
                        <button className="btn join-item ">Scan</button>
                      </div>
                    </div>
                    <div className=''>
                      <button className="btn btn-accent">Prove</button>
                    </div>
                  </div>

                </div>
    );
}
export default ProveForm;