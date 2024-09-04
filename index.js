import {Web5 } from "@web5/api";
import {VerifiableCredential} from "@web5/credentials";

//APP IDENTIFICATION

//creating a new Web5 instance which automatically creates a decentralized identifier
const {web5, did:maiCodes} =  await Web5.connect();
console.log(maiCodes); // --> returns DID

//Access Bearer DID is the JSON object which contain metadata about DID ownership
const {did:maiBearerDid} = await web5.agent.identity.get({didUri: maiCodes});
console.log(maiBearerDid); // --> returns Bearer DID object

//APP VERIFIABLE CREDENTIAL 
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

console.log(`vc: ${vc}`);