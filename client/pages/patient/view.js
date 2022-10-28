import { useState } from "react";
import Navbar from "../../components/navbar";

export default function View({ getContract }) {
    const [state, setState] = useState()
    const [records, setRecords] = useState()
    let wallet = null
    if (typeof window !== 'undefined') {
        // Perform localStorage action
        wallet = localStorage.getItem("walletAddress")
        console.log(wallet)

    }
    function handleChange(evt) {

        const value = evt.target.value;

        setState({
            ...state,
            [evt.target.name]: value
        });
    }

    const fetchAllRecords = async () => {
        let count = await getContract(window).getRecordCount();
        console.log(">>>>>", count.toString())
        let allRecords = []
        for (let i = 0; i < count; i++) {
            let record = await getContract(window).getRecord(i);
            allRecords.push(record)
        }
        const newRecords = allRecords.filter((record) => {

            if ((String(record[1]).toUpperCase() === String(wallet).toUpperCase())) {
                return record
            }
            else {
                console.log(record[1], wallet)
            }
        })
        console.log(newRecords)
        setRecords(newRecords)
    };
    return (
        <>
            <Navbar />
            <div className="min-h-screen ">
                <div className=" p-10">
                    <div className="shadow-lg rounded-md bg-black bg-opacity-25 pt-10 border border-5 border-white rounded-md p-10">

                        <div className="grid place-items-center gap-3 mt-2">

                            {/* <label className="input-group ">
                                <span className="label border text-xsm w-1/3 bg-zinc-500 text-white">Patient Pub Key</span>
                                <input required type={"text"} className="bg-black bg-opacity-25 input w-full text-black" name="patient_pubKey" onChange={handleChange} />
                            </label> */}

                            <div className="flex items-center justify-center mt-4">
                                <button className="btn glass text-white" onClick={() => fetchAllRecords()}>
                                    Fetch All My Medical Records
                                </button>
                            </div>
                            <div className="grid place-items-center ">
                                {records ? <div className="bg-amber-200 text-black px-5 py-3 mb-3 rounded-md border-b-4">
                                    RECORDS

                                    {
                                        records.map((record, index) => {
                                            return (
                                                <div key={index} className="border mt-4 border-black rounded p-5">
                                                    <div className="flex justify-between">
                                                        <div className="text-black">
                                                            Pub key patient:
                                                        </div>
                                                        <div className="w-1/2 truncate ...">
                                                            {record[1]}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <div className="text-black">
                                                            Allergies:
                                                        </div>
                                                        <div>
                                                            {record[2]}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <div className="text-black">
                                                            Symptoms:
                                                        </div>
                                                        <div>
                                                        </div>
                                                        {record[3]}
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <div className="text-black">
                                                            Previous Diagnosis:
                                                        </div>
                                                        <div>
                                                        </div>
                                                        {record[4]}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div> : null}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}