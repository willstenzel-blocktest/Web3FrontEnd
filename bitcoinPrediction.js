
var contractAddress = "0x573fbb43b86b57bf2e5bb8509d992a33208fac2e";
var abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "blockTESTUserId",
				"type": "string"
			},
			{
				"name": "val",
				"type": "string"
			}
		],
		"name": "predict",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "blockTESTUserId",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "predictions",
				"type": "int256"
			},
			{
				"indexed": false,
				"name": "uniquePredictions",
				"type": "int256"
			}
		],
		"name": "PredictionEvent",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "blockTESTUserId",
				"type": "string"
			}
		],
		"name": "getPrediction",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "predictions",
		"outputs": [
			{
				"name": "",
				"type": "int256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "uniquePredictions",
		"outputs": [
			{
				"name": "",
				"type": "int256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

var result = {};
result["status"] = "0"; // only if failed, "1" if successful
result["message"] = ""; // if true, send transaction ID else send the error

function hasWeb3() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    return true;
  } else {
    return false;
  }
}

function onRobsten() {
  return new Promise(resolve => {
    try {
      web3.eth.net.getId()
      .then((netId) => {
        if (netId == 3) {
          resolve(true);
        }
        else {
          resolve(false);
        }
        });
    }
    catch {
    web3.version.getNetwork((err, netId) => {
      console.log(netId);
      if (netId == 3) {
        resolve(true);
      }
      else {
        resolve(false);
      }
      });
    }
  });
}



async function sendPrediction(blockTESTUserId, val) {
  if (hasWeb3) {
    // Use Mist/MetaMask's provider
    web3 = new Web3(web3.currentProvider);
    contract = new web3.eth.Contract(abi, contractAddress);
    curAccount = await ethereum.enable();
    console.log(curAccount.toString());
    //try {
      contract.methods.predict(blockTESTUserId, val).send({ from: curAccount.toString() }).then(function(receipt) {
        result["status"] = "1";
        result["message"] = receipt["transactionHash"];
        console.log(result);
        return result; // Sucess
      });
    //} catch(err) {
      return result; // Failed, error from transaction
    //}
  }
  return result; // Failed, web3 provider not detected
}

// Prediction button handler
document.getElementById('enter').addEventListener('click', async function() {
    var good = await onRobsten();
    if (good) {
      var blockTESTUserId = document.getElementById("email-box").value;
      var val = document.getElementById("value-box").value
      sendPrediction(blockTESTUserId, val);
    }
    else {
      alert("Please switch your network to Ropsten");
    }
  });
