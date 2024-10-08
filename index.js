import {Web5 } from "@web5/api";
import {VerifiableCredential} from "@web5/credentials";

//APP IDENTIFICATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//creating a new Web5 instance which automatically creates a decentralized identifier
// ---------> the connection function uses "dht" as the DID method
const {web5, did:maiCodes} =  await Web5.connect();

//Access Bearer DID is the JSON object which contain metadata about DID ownership
const {did:maiBearerDid} = await web5.agent.identity.get({didUri: maiCodes});
//console.log(maiCodes); // --> returns DID
//console.log(maiBearerDid); // --> returns Bearer DID object

//APP VERIFIABLE CREDENTIAL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const vc = await VerifiableCredential.create({
    type: "Web5QuickstartCompletionCredential",
    issuer: maiCodes,
    subject: maiCodes,
    data: {
        name: "Mai Codes",
        completionDate: new Date().toISOString(),
        expertiseLevel: "Beginner"
    }
});
//console.log(`vc: ${vc}`);

//ISSUEER SIGNS VERIFIABLE CREDENTIAL (conversion to JSON Web Token)
const signedVc = await vc.sign({did:maiBearerDid });
//console.log(signedVc);

//STORING VC/JWT IN DWN

const {record} = await web5.dwn.records.create({
    data: signedVc,
    message: {
        schema: 'Web5QuickstartCompletionCredential',
        dataFormat: 'application/vc+jwt',
        //declaring the record to be viewed w/o permissions
        published: true

    }
});

//console.log("writeResult", record);

// READING OPTIONAL PERMISSION DATA FROM DWN
const readSignedVc = await record.data.text();
//console.log("read Public", readSignedVc);

//PARSE VC/inspecting VC: converting JWT to JSON
const parsedVc = VerifiableCredential.parseJwt({vcJwt: readSignedVc});
console.log(parsedVc);