import json
from web3 import Web3
from solcx import compile_standard, install_solc

with open('contracts/PatentRegistry.sol', 'r') as file:
    contract_source_code = file.read()

install_solc('0.5.0')

compiled_sol = compile_standard({
    "language": "Solidity",
    "sources": {
        "PatentRegistry.sol": {
            "content": contract_source_code
        }
    },
    "settings": {
        "outputSelection": {
            "*": {
                "*": ["abi", "metadata", "evm.bytecode", "evm.bytecode.sourceMap"]
            }
        }
    }
}, solc_version='0.5.0')

contract_interface = compiled_sol['contracts']['PatentRegistry.sol']['PatentRegistry']
abi = contract_interface['abi']
bytecode = contract_interface['evm']['bytecode']['object']

with open('contracts/abi.json', 'w') as abi_file:
    json.dump(abi, abi_file)

with open('contracts/bytecode.txt', 'w') as bytecode_file:
    bytecode_file.write(bytecode)

w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))

if w3.is_connected():
    print("✓ Connected to Ganache")
else:
    print("✗ Could not connect to Ganache")
    exit()

w3.eth.default_account = w3.eth.accounts[0]

PatentRegistry = w3.eth.contract(abi=abi, bytecode=bytecode)
tx_hash = PatentRegistry.constructor().transact()
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

contract_address = tx_receipt['contractAddress']
print(f"✓ Contract deployed at: {contract_address}")

with open('contracts/contract_address.txt', 'w') as addr_file:
    addr_file.write(contract_address)

print("✓ Contract address saved to contracts/contract_address.txt")