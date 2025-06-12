from rest_framework.serializers import ModelSerializer, model_meta, raise_errors_on_nested_writes
from .models import Movie, Review
from authenticate.models import User
from authenticate.utils import send_account_activation

class MovieSerializer(ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class ReviewSerializer(ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ProfileSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'name', 'profile', 'favourite', 'is_email_verified']
        read_only_fields = ['username', 'is_email_verified']
    def update(self, instance, validated_data):
        prev_email = None
        if (instance.email != validated_data['email']):
            prev_email = instance.email
            validated_data['is_email_verified'] = False

        raise_errors_on_nested_writes('update', self, validated_data)
        info = model_meta.get_field_info(instance)

        # Simply set each attribute on the instance, and then save it.
        # Note that unlike `.create()` we don't need to treat many-to-many
        # relationships as being a special case. During updates we already
        # have an instance pk for the relationships to be associated with.
        m2m_fields = []
        for attr, value in validated_data.items():
            if attr in info.relations and info.relations[attr].to_many:
                m2m_fields.append((attr, value))
            else:
                setattr(instance, attr, value)
        instance.save()
        # Note that many-to-many fields are set after updating instance.
        # Setting m2m fields triggers signals which could potentially change
        # updated instance and we do not want it to collide with .update()
        for attr, value in m2m_fields:
            field = getattr(instance, attr)
            field.set(value)

        
        if prev_email:
            send_account_activation(instance)
        
        return instance