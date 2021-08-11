// const pinataSDK = require('@pinata/sdk');
//const pinata = pinataSDK('29d13c604b386f215c27', 'b08b8be818b7d3bdd0a802f7565edef6cdcf50641ffab7b006c1897a5d22079a');

const axios = require('axios');
const fs = require('fs');
const NodeFormData = require('form-data');
//import NodeFormData from 'form-data';
const recursive = require('recursive-fs');
const basePathConverter = require('base-path-converter');

const key = "29d13c604b386f215c27";
const secret = "b08b8be818b7d3bdd0a802f7565edef6cdcf50641ffab7b006c1897a5d22079a";


const testAuthentication = () => {
    const url = `https://api.pinata.cloud/data/testAuthentication`;
    return axios
        .get(url, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret
            }
        })
        .then(function (response) {
            //handle your response here
            console.log(response.data);

        })
        .catch(function (error) {
            //handle error here
            console.log(error.response.data);
        });


};


const pinOneFileToIPFS = async(sourcePath) => {


    return new Promise((resolve, reject) => {
        //reject("FORCE error");
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const src = '../team';

        //we need to create a single read stream instead of reading the directory recursively
        const data = new NodeFormData();

        data.append('file', fs.createReadStream(sourcePath));


        axios.post(
            url,
            data,
            {
                withCredentials: true,
                maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large directories
                maxBodyLength: 'Infinity',
                headers: {
                    'Content-type': `multipart/form-data; boundary= ${data._boundary}`,
                    'pinata_api_key': key,
                    'pinata_secret_api_key': secret
                }
            }).then(function (result) {
            if (result.status !== 200) {
                reject(new Error(`unknown server response while pinning File to IPFS: ${result}`));
            }
            resolve(result.data);
        }).catch(function (error) {
            const formattedError = handleError(error);
            reject(formattedError);
        });

    });
};




async function asyncCall() {


    const fs = require('fs')


    let funkYNFTJSONArray = [];
    //const jsonString = JSON.stringify(customer)fs.writeFileSync('./newCustomer.json', jsonString)



    recursive.readdirr('../team', async function (err, dirs, files) {

        
        let i = 0;
        for (const file of files) {
            i++;
            console.log("File Name " + file + "file number " + i);
            if (i!= 1) {
                let v;
                let funkYNFTJSON = {
                    name:"",                    
                    image:"",                    
                    description: "FUNKY FLOKIS is a collection of 5,106 brave puppies exploring the metaverse and living on the Ethereum blockchain.",
                    attributes : [
                        {
                          "trait_type": "HEAD", 
                          "value": ""
                        }, 
                        {
                          "trait_type": "EYE", 
                          "value": ""
                        }, 
                        {
                          "trait_type": "FACE", 
                          "value": ""
                        }
                    ]

                };

                try {
                    v = await pinOneFileToIPFS(file);
                    funkYNFTJSON.name = "Funky Floki " + (i-2);
                    funkYNFTJSON.image = "https://gateway.pinata.cloud/ipfs/" + v.IpfsHash;
                    funkYNFTJSON.cid =  v.IpfsHash;
                    funkYNFTJSON.attributes[0].value = "head1"
                    funkYNFTJSON.attributes[1].value = "eye" + (((i+1)%3)+1).toString();
                    funkYNFTJSON.attributes[2].value = "face" + (((i+1)%3)+1).toString();

                } catch(e) {
                    //process e
                    v = e;
                    funkYNFTJSON = {name:"ERROR UPLOADING to IPFS"}
                }


                funkYNFTJSONArray.push(JSON.stringify(funkYNFTJSON));

                

                if(funkYNFTJSONArray.length == (files.length-1)){
                    


                    let fileNumber = 0;
                    for (const tempJSONString of funkYNFTJSONArray) { 
                        let fileName = '../FlokiJSONs/'+fileNumber.toString();
                        fileNumber++;
                        fs.writeFileSync(fileName, tempJSONString);
                    }
                    console.log("ALl files uploaded \n" , funkYNFTJSONArray.join("\n"));


                }
                
            };
        }
    });


    

    

  

}


asyncCall();
