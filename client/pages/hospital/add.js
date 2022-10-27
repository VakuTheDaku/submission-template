import { useState } from "react";
import Navbar from "../../components/navbar";

export default function Add({ }) {
    const [state, setState]= useState()
    function handleChange(evt) {

        const value = evt.target.value;

        setState({
            ...state,
            [evt.target.name]: value
        });
    }
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-amber-200">
                <div className="bg-amber-200 p-10">
                    <div className="shadow-lg rounded-md bg-black bg-opacity-25 pt-10 border border-5 border-white rounded-md p-10">
                        <div className="grid place-items-center ">
                            <div className="bg-amber-200 text-black px-5 py-3 mb-3 glass rounded-md border-b-4">
                                RECORD
                            </div>
                        </div>
                        <div className="grid place-items-center gap-3 mt-2">
                            <label className="input-group ">
                                <span className="label border text-xsm w-1/3">Doctor Pub Key</span>
                                <input required type={"text"} className=" bg-black bg-opacity-25 input w-full text-black" name="doctor_pubKey" onChange={handleChange} />
                            </label>
                            <label className="input-group ">
                                <span className="label border text-xsm w-1/3">Patient Pub Key</span>
                                <input required type={"text"} className="bg-black bg-opacity-25 input w-full text-black" name="patient_pubKey" onChange={handleChange} />
                            </label>
                            <label className="input-group ">
                                <span className="label border text-xsm w-1/3">Known Allergy Symptoms</span>
                                <input required type={"text"} className="bg-black bg-opacity-25 input w-full text-black" name="known_allergies" onChange={handleChange} />
                            </label>
                            <label className="input-group ">
                                <span className="label border text-xsm w-1/3">Diagonosis</span>
                                <input required type={"text"} className="bg-black bg-opacity-25 input w-full text-black" name="diagnosis" onChange={handleChange} />
                            </label>
                            <label className="input-group ">
                                <span className="label border text-xsm w-1/3">Symptoms</span>
                                <input required type={"text"} className="bg-black bg-opacity-25 input w-full text-black" name="symptoms" onChange={handleChange} />
                            </label>
                            <div className="flex items-center justify-center mt-4">
                                <button className="btn glass text-white">
                                    Push to Blockchain
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}