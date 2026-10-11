from django.contrib import admin

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at', 'email_delivered')
    list_filter = ('email_delivered', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at',)
