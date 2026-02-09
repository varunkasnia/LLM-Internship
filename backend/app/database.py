"""Database configuration and session management."""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

def _get_database_url() -> str:
    url = os.getenv("DATABASE_URL")
    if url:
        # Render/PostgreSQL use postgres:// - convert for SQLAlchemy
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        # Reject placeholder host (common mistake: example left as "host")
        if "@host:" in url or "@host/" in url:
            raise ValueError(
                "DATABASE_URL contains placeholder 'host'. "
                "Use the full URL from Render Dashboard → PostgreSQL → Connect (External or Internal URL)."
            )
        return url
    # Build from Render-style individual env vars (set when DB is linked)
    host = os.getenv("PGHOST")
    if host:
        user = os.getenv("PGUSER", "")
        password = os.getenv("PGPASSWORD", "")
        port = os.getenv("PGPORT", "5432")
        db = os.getenv("PGDATABASE", "")
        url = f"postgresql://{user}:{password}@{host}:{port}/{db}"
        return url
    return "sqlite:///./hrms.db"

DATABASE_URL = _get_database_url()

connect_args = {}
if "sqlite" in DATABASE_URL:
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables."""
    Base.metadata.create_all(bind=engine)
