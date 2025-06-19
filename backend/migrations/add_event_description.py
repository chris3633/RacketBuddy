"""add event description

Revision ID: add_event_description
Revises: add_profile_image
Create Date: 2024-03-21 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_event_description'
down_revision = 'add_profile_image'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('events', sa.Column('description', sa.String(), nullable=True))

def downgrade():
    op.drop_column('events', 'description') 