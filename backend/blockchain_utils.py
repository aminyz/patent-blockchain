from web3 import Web3
from datetime import datetime
import json


class BlockchainUtils:
    """کلاس مدیریت عملیات بلاک‌چین بدون نیاز به Smart Contract"""

    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))
        self.accounts = self.w3.eth.accounts
        self.main_account = self.accounts[0]

    def connect(self):
        """بررسی اتصال به گاناش"""
        if self.w3.is_connected():
            return True
        return False

    def register_hash(self, file_hash):
        """
        ثبت هش در بلاک‌چین با ارسال تراکنش
        هش در دیتای تراکنش ذخیره می‌شود
        """
        try:
            hash_hex = '0x' + file_hash

            data_length = len(file_hash)  
            estimated_gas = 21000 + (data_length * 68)  

            transaction = {
                'from': self.main_account,
                'to': self.main_account,  
                'value': 0,
                'gas': estimated_gas + 10000,  
                'gasPrice': self.w3.eth.gas_price,
                'nonce': self.w3.eth.get_transaction_count(self.main_account),
                'data': hash_hex  
            }

            tx_hash = self.w3.eth.send_transaction(transaction)

            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)

            print(f"✅ تراکنش ثبت شد: {tx_hash.hex()}")
            print(f"📦 بلاک شماره: {receipt['blockNumber']}")
            print(f"⛽ Gas مصرفی: {receipt['gasUsed']}")

            return {
                'success': True,
                'transaction_hash': tx_hash.hex(),
                'block_number': receipt['blockNumber'],
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            print(f"❌ خطا در ثبت: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

    def find_hash_in_blockchain(self, file_hash):
        """
        جستجوی هش در بلاک‌چین
        بررسی تراکنش‌های قبلی برای یافتن هش
        """
        try:
            latest_block = self.w3.eth.block_number

            print(f"🔍 جستجو در {latest_block} بلاک...")

            for block_num in range(latest_block, max(0, latest_block - 500), -1):
                block = self.w3.eth.get_block(block_num, full_transactions=True)

                for tx in block.transactions:
                    tx_from = tx['from']
                    if isinstance(tx_from, bytes):
                        tx_from = tx_from.hex()

                    if tx_from.lower() == self.main_account.lower():
                        tx_input = tx['input'] if 'input' in tx else tx.get('data', '')

                        if isinstance(tx_input, bytes):
                            tx_input = tx_input.hex()

                        if isinstance(tx_input, str) and len(tx_input) > 2:
                            if tx_input.startswith('0x'):
                                tx_input = tx_input[2:]

                            if tx_input.lower() == file_hash.lower():
                                print(f"✅ هش در بلاک {block_num} پیدا شد!")
                                return {
                                    'found': True,
                                    'transaction_hash': tx['hash'].hex() if isinstance(tx['hash'], bytes) else tx[
                                        'hash'],
                                    'block_number': block_num,
                                    'block_timestamp': datetime.fromtimestamp(
                                        block['timestamp']
                                    ).strftime('%Y-%m-%d %H:%M:%S'),
                                    'blockchain_timestamp': block['timestamp']
                                }

            print("❌ هش در بلاک‌چین یافت نشد")
            return {
                'found': False
            }

        except Exception as e:
            print(f"❌ خطا در جستجو: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                'found': False,
                'error': str(e)
            }

    def get_account_info(self):
        """دریافت اطلاعات اکانت"""
        return {
            'account': self.main_account,
            'balance': self.w3.from_wei(
                self.w3.eth.get_balance(self.main_account), 'ether'
            ),
            'network_id': self.w3.net.version,
            'block_number': self.w3.eth.block_number
        }