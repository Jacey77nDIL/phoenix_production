from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

origin = os.getenv("origins")
db_link = os.getenv("DATABASE_URL")

if __name__ == "__main__":
    # Make sure FastAPI listens on the environment-provided PORT
    port = int(os.getenv("PORT", 8000))  # default to 8000 if not provided
    uvicorn.run(app, host="0.0.0.0", port=PORT)

app = FastAPI()

# CORS configuration to allow requests from your frontend (localhost:3000)
origins = [
    f"{origin}",  # The frontend is likely running here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PostgreSQL Database URL (Neon)
DATABASE_URL = f"{db_link}"

# SQLAlchemy setup for PostgreSQL
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# Define the Waitlist table


class Waitlist(Base):
    __tablename__ = "waitlist"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)


# Create tables in the database (if not already created)
Base.metadata.create_all(bind=engine)

# Pydantic model for data validation


class WaitlistCreate(BaseModel):
    name: str
    email: str


@app.post("/add_to_waitlist/")
async def add_to_waitlist(entry: WaitlistCreate):
    db = SessionLocal()
    try:
        new_entry = Waitlist(
            name=entry.name,
            email=entry.email,
        )
        db.add(new_entry)
        db.commit()
        db.refresh(new_entry)
        return {"message": "User added to waitlist", "data": new_entry.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
