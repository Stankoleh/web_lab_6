from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'role']

    def get_role(self, obj):
        return 'admin' if obj.is_staff else 'regular'


class UserWriteSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=['admin', 'regular'], write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}


    def validate_username(self, value):
        value = value.strip().replace(' ', '_')
        if not value:
            raise serializers.ValidationError('Username is required')
        return value

    def create(self, validated_data):
        role = validated_data.pop('role')
        user = User(username=validated_data['username'], is_staff=(role == 'admin'))
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        role = validated_data.pop('role', None)
        if 'username' in validated_data:
            instance.username = validated_data['username']
        if 'password' in validated_data and validated_data['password']:
            instance.set_password(validated_data['password'])
        if role is not None:
            instance.is_staff = (role == 'admin')
        instance.save()
        return instance
