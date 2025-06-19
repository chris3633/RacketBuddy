"""add profile image

Revision ID: add_profile_image
Revises: 
Create Date: 2024-03-19

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_profile_image'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('users', sa.Column('profile_image', sa.String(), nullable=True))

def downgrade():
    op.drop_column('users', 'profile_image')