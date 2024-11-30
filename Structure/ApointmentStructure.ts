import ApointmentPresenceStructure from "./ApointmentPresenceStructure";
import CompanyStructure from "./CompanyStructure"

type ApointmentStructure = {
    id: string,
    apointmentDate: Date,
    company?: CompanyStructure,
    presences?: ApointmentPresenceStructure[]
}

export default ApointmentStructure;