# backend/app/models/game_log_model.py
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.models.database import Base

class GameLog(Base):
    __tablename__ = "game_logs"

    id = Column(Integer, primary_key=True, index=True)
    move_history_json = Column(Text, nullable=False)  # JSON as string
    insights = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
