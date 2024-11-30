import ApointmentInterviewedStructure from "./ApointmentInterviewedStructure";

type ApointmentPresenceStructure = {
    id: string,
    apointmentId: string,
    wasPresent: boolean,
    testResult?: string,
    Client: ApointmentInterviewedStructure
}


export default ApointmentPresenceStructure;