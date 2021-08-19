import { Contact } from '../../../shared/contact';

export class Deceased {
  constructor(
    public id: string,
    public deceasedName: string,
    public deathDate: string,
    public age: number,
    public dob: Date,
    public deathPlace: string,
    public address1: string,
    public address2: string,
    public address3: string,
    public county: string,
    public contact: Contact,
    public doctor: string,
    public doctorNo: number,
    public church: string,
    public cemetry: string,
    public grave: string,
    public clergy: string,
    public reposeDate: Date,
    public reposeTime: Date,
    public reposeEndTime: Date,
    public removalDate: Date,
    public removalTime: Date,
    public churchArrivalDate: Date,
    public churchArrivalTime: Date,
    public massDate: Date,
    public massTime: Date,
    public entryDate: Date,
    public formType: string,
    public createdBy: string
  ) {}
}
