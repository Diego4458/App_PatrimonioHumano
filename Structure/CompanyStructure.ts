import ContactStructure from "./ContactStructure";

type CompanyStructure = {
    id: string,
    name: string,
    picHash: string,
    Contacts: ContactStructure[]
}

export default CompanyStructure;