from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    dependencies = [
        ('playlists', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PlaylistMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('author', models.CharField(default='Anonymous', max_length=60)),
                ('text', models.CharField(max_length=300)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('playlist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='playlists.playlist')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
