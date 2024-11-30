import CompanyStructure from "./CompanyStructure";

type FileDetailsStructure = {
    id: number,
    company?: CompanyStructure,
    fileName: string,
    fileType: string,
    fileHash: string,
    size: number,
    createDate: number,
    updateDate: number,
    ApointmentPresenceId?: number,
    interviewClientId?: number,
}

export default FileDetailsStructure;
