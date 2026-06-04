from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# XAMPP local MySQL connection string
DATABASE_URL = "mysql+pymysql://root:@localhost:3306/directory_db"

engine = create_engine(
    DATABASE_URL, 
    pool_size=10, 
    max_overflow=20,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get a database session per request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()