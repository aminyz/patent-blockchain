from django.db import models


class PatentRecord(models.Model):
    file_name = models.CharField(max_length=255)
    file_hash = models.CharField(max_length=64, unique=True, db_index=True)
    blockchain_tx = models.CharField(max_length=66, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file_name} - {self.file_hash[:10]}..."