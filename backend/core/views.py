import hashlib
import json
from datetime import datetime
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import PatentRecord
from blockchain_utils import BlockchainUtils

blockchain = BlockchainUtils()


def home(request):
    """صفحه اصلی"""
    return render(request, 'core/home.html')


def calculate_file_hash(file):
    """محاسبه SHA256 هش فایل"""
    sha256_hash = hashlib.sha256()
    for chunk in file.chunks():
        sha256_hash.update(chunk)
    return sha256_hash.hexdigest()


@csrf_exempt
def register_patent(request):
    """ثبت سند جدید در بلاک‌چین"""
    if request.method != 'POST':
        return render(request, 'core/register.html')

    try:
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return JsonResponse({
                'status': 'error',
                'message': 'لطفاً یک فایل انتخاب کنید'
            })

        file_hash = calculate_file_hash(uploaded_file)
        file_name = uploaded_file.name

        existing_record = PatentRecord.objects.filter(file_hash=file_hash).first()
        if existing_record:
            return JsonResponse({
                'status': 'duplicate',
                'message': '⚠️ این سند قبلاً در بلاک‌چین ثبت شده است',
                'file_hash': file_hash,
                'file_name': file_name,
                'timestamp': existing_record.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'blockchain_tx': existing_record.blockchain_tx
            })

        result = blockchain.register_hash(file_hash)

        if result['success']:
            patent_record = PatentRecord.objects.create(
                file_name=file_name,
                file_hash=file_hash,
                blockchain_tx=result['transaction_hash']
            )

            try:
                w3 = blockchain.w3
                receipt = w3.eth.get_transaction_receipt(result['transaction_hash'])
                block = w3.eth.get_block(receipt['blockNumber'])
                block_timestamp = datetime.fromtimestamp(block['timestamp'])
                timestamp_str = block_timestamp.strftime('%Y-%m-%d %H:%M:%S')
            except:
                timestamp_str = patent_record.timestamp.strftime('%Y-%m-%d %H:%M:%S')

            return JsonResponse({
                'status': 'success',
                'message': '✅ سند با موفقیت در بلاک‌چین ثبت شد',
                'file_hash': file_hash,
                'file_name': file_name,
                'transaction_hash': result['transaction_hash'],
                'block_number': result['block_number'],
                'timestamp': timestamp_str,
                'blockchain_timestamp': timestamp_str
            })
        else:
            return JsonResponse({
                'status': 'error',
                'message': f'❌ خطا در ثبت در بلاک‌چین: {result.get("error", "خطای ناشناخته")}'
            })

    except Exception as e:
        import traceback
        print("❌ خطای سیستمی:")
        traceback.print_exc()
        return JsonResponse({
            'status': 'error',
            'message': f'❌ خطای سرور: {str(e)}'
        })


@csrf_exempt
def verify_patent(request):
    """استعلام وجود سند در بلاک‌چین"""
    if request.method != 'POST':
        return render(request, 'core/verify.html')

    try:
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return JsonResponse({
                'status': 'error',
                'message': 'لطفاً یک فایل انتخاب کنید'
            })

        # محاسبه هش
        file_hash = calculate_file_hash(uploaded_file)

        # جستجو در بلاک‌چین
        result = blockchain.find_hash_in_blockchain(file_hash)

        if result['found']:
            return JsonResponse({
                'status': 'found',
                'message': '✅ این سند در بلاک‌چین ثبت شده است',
                'file_hash': file_hash,
                'transaction_hash': result['transaction_hash'],
                'block_number': result['block_number'],
                'timestamp': result['block_timestamp'],
                'blockchain_timestamp': result['blockchain_timestamp']
            })
        else:
            local_record = PatentRecord.objects.filter(file_hash=file_hash).first()
            if local_record:
                return JsonResponse({
                    'status': 'found',
                    'message': '✅ این سند در سیستم ثبت شده است',
                    'file_hash': file_hash,
                    'file_name': local_record.file_name,
                    'timestamp': local_record.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                    'blockchain_tx': local_record.blockchain_tx
                })
            else:
                return JsonResponse({
                    'status': 'not_found',
                    'message': 'ℹ️ این سند در بلاک‌چین یافت نشد',
                    'file_hash': file_hash
                })

    except Exception as e:
        import traceback
        print("❌ خطا در verify:")
        traceback.print_exc()
        return JsonResponse({
            'status': 'error',
            'message': f'❌ خطا در بررسی: {str(e)}'
        })